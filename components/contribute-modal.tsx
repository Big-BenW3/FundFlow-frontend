"use client";

/* Contribute modal: amount presets → anonymous toggle → confirm → success. */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@/components/ui";
import { AMOUNT_PRESETS, ApiError, api, KORA_MOCK, KORA_PUBLIC_KEY, naira } from "@/lib/api";
import { launchKoraCheckout, loadKoraScript } from "@/lib/kora";
import { useAuth } from "@/components/auth-provider";
import type { Campaign, ContributionItem } from "@/types";

type Phase = "choose" | "confirming" | "pending" | "success" | "error";

export type PaymentMethod = "bank_transfer" | "card";

export default function ContributeModal({
  open,
  campaign,
  onClose,
  onSuccess,
}: {
  open: boolean;
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(AMOUNT_PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [phase, setPhase] = useState<Phase>("choose");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<ContributionItem | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (open) {
      setPhase("choose");
      setMessage("");
      setPending(null);
      setChecking(false);
    }
  }, [open ]);

  if (!open) return null;

  const effective = custom.trim() ? Number(custom.replace(/[^0-9.]/g, "")) : amount;

  async function refreshStatus(id: number): Promise<ContributionItem> {
    return api.get<ContributionItem>(`/contributions/${id}`);
  }

  function settleQueries() {
    void queryClient.invalidateQueries({ queryKey: ["campaign"] });
    void queryClient.invalidateQueries({ queryKey: ["activity"] });
  }

  async function checkPending() {
    if (!pending) return;
    setChecking(true);
    try {
      const latest = await refreshStatus(pending.id);
      setPending(latest);
      if (latest.status === "SUCCESS") {
        setPhase("success");
        setMessage(`₦${Number(latest.amount).toLocaleString()} received. Thank you!`);
        settleQueries();
        onSuccess();
      } else if (latest.status === "FAILED") {
        setPhase("error");
        setMessage("The payment could not be confirmed. Please try again.");
        settleQueries();
      }
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not refresh status.");
    } finally {
      setChecking(false);
    }
  }

  async function pollUntilSettled(id: number, timeoutMs: number): Promise<ContributionItem> {
    const start = Date.now();
    let latest = await refreshStatus(id);
    while (Date.now() - start < timeoutMs && latest.status === "PENDING") {
      await new Promise((r) => setTimeout(r, 1000));
      latest = await refreshStatus(id);
    }
    return latest;
  }

  async function submit() {
    if (!effective || effective < 100) {
      setPhase("error");
      setMessage("Minimum contribution is ₦100.");
      return;
    }
    setPhase("confirming");
    setMessage("");
    try {
      const contribution = await api.post<ContributionItem>(
        `/campaigns/${campaign.id}/contribute`,
        { amount: effective, anonymous, payment_method: paymentMethod }
      );
      // Live card flow: open Kora Checkout Standard with the backend reference.
      // Webhook still confirms it — never trust Inline callback alone.
      if (!KORA_MOCK && KORA_PUBLIC_KEY && paymentMethod === "card") {
        const loaded = await loadKoraScript();
        if (!loaded) {
          setPending(contribution);
          setPhase("pending");
          setMessage("Checkout script failed to load. Use bank transfer instead.");
          settleQueries();
          onSuccess();
          return;
        }
        setPending(contribution);
        setPhase("pending");
        setMessage("Complete the card payment in the Kora window, then wait for confirmation.");
        const ok = launchKoraCheckout({
          key: KORA_PUBLIC_KEY,
          reference: contribution.kora_reference,
          amount: Math.round(effective),
          currency: campaign.currency || "NGN",
          customer: {
            name: user?.name || "FundFlow Donor",
            email: user?.email || "donor@fundflow.app",
          },
          narration: `FundFlow campaign ${campaign.id}`,
          channels: ["card", "bank_transfer"],
          default_channel: "card",
          onSuccess: () => {
            void (async () => {
              setChecking(true);
              try {
                const latest = await pollUntilSettled(contribution.id, 15000);
                setPending(latest);
                if (latest.status === "SUCCESS") {
                  setPhase("success");
                  setMessage(`₦${Number(latest.amount).toLocaleString()} received. Thank you!`);
                  settleQueries();
                  onSuccess();
                }
              } finally {
                setChecking(false);
              }
            })();
          },
          onFailed: () => {
            setPhase("error");
            setMessage("The card payment failed. Please try again.");
            settleQueries();
          },
          onClose: () => {
            // Keep pending view so donor can retry / check status.
            setMessage("Kora window closed. If you paid, hit Check status.");
          },
          onPending: () => {
            setMessage("Bank transfer pending. Confirming via Kora webhook…");
          },
        });
        if (!ok) {
          setMessage("Could not open Kora checkout. Use bank transfer instead.");
        }
        settleQueries();
        return;
      }
      // Mock settles synchronously; live bank-transfer stays PENDING until Kora webhook.
      const start = Date.now();
      let settled = contribution;
      while (Date.now() - start < 4000 && settled.status === "PENDING") {
        await new Promise((r) => setTimeout(r, 600));
        settled = await refreshStatus(contribution.id);
      }
      if (settled.status === "SUCCESS") {
        setPhase("success");
        setMessage(`₦${Number(settled.amount).toLocaleString()} received. Thank you!`);
        settleQueries();
        onSuccess();
      } else if (settled.status === "PENDING") {
        // Live mode: do not fake success. Show pending instructions.
        setPending(settled);
        setPhase("pending");
        setMessage(
          paymentMethod === "card"
            ? "Card payment initiated. Complete it with Kora, then check status."
            : "Transfer to the campaign collection account, then check status."
        );
        settleQueries();
        onSuccess();
      } else {
        setPhase("error");
        setMessage("The payment could not be confirmed. Please try again.");
        settleQueries();
      }
    } catch (err) {
      setPhase("error");
      setMessage(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center overflow-y-auto p-4">
        <div className="modal-sheet w-full max-w-md rounded-lg bg-white p-6 shadow-pop sm:p-8">
          {phase === "success" ? (
            <SuccessView message={message} onClose={onClose} />
          ) : phase === "pending" && pending ? (
            <PendingView
              contribution={pending}
              campaign={campaign}
              message={message}
              checking={checking}
              onCheck={checkPending}
              onClose={onClose}
            />
          ) : (
            <ChooseView
              campaignTitle={campaign.title}
              amount={amount}
              custom={custom}
              anonymous={anonymous}
              paymentMethod={paymentMethod}
              effective={effective || 0}
              phase={phase}
              message={message}
              setAmount={setAmount}
              setCustom={setCustom}
              setAnonymous={setAnonymous}
              setPaymentMethod={setPaymentMethod}
              onSubmit={submit}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessView({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#E9F9EF]">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
          <path className="draw-check" d="M4 12.5l5 5L20 6.5" />
        </svg>
      </span>
      <h3 className="display-md mt-5 text-2xl">Contribution confirmed</h3>
      <p className="mt-2 text-sm text-body">{message}</p>
      <p className="mt-3 rounded-md bg-soft px-3 py-2 font-mono text-xs text-body">
        Webhook verified · ledger updated · progress recalculated
      </p>
      <Button className="mt-6 w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}

function PendingView({
  contribution,
  campaign,
  message,
  checking,
  onCheck,
  onClose,
}: {
  contribution: ContributionItem;
  campaign: Campaign;
  message: string;
  checking: boolean;
  onCheck: () => void;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#FFF7E6]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      </span>
      <h3 className="display-md mt-5 text-2xl">Payment pending</h3>
      <p className="mt-2 text-sm text-body">{message}</p>
      <div className="mt-4 rounded-md border border-hairline bg-soft p-3.5 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Reference</p>
        <p className="mt-1 break-all font-mono text-xs">{contribution.kora_reference}</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">Amount</p>
        <p className="mt-1 text-sm font-extrabold">
          {naira(contribution.amount)} · {contribution.payment_method}
        </p>
        {campaign.account && (
          <>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">
              Pay to ({campaign.account.bank_name})
            </p>
            <p className="mt-1 text-sm font-extrabold tracking-wide">
              {campaign.account.account_number}
            </p>
          </>
        )}
      </div>
      <p className="mt-3 font-mono text-xs text-muted">
        Status: {contribution.status} · confirms via Kora webhook
      </p>
      <Button className="mt-5 w-full" size="lg" disabled={checking} onClick={onCheck}>
        {checking ? (
          <>
            <Spinner /> Checking…
          </>
        ) : (
          <>Check status</>
        )}
      </Button>
      <button
        onClick={onClose}
        className="mt-3 w-full text-center text-sm font-medium text-body hover:text-ink"
      >
        Done
      </button>
    </div>
  );
}

function ChooseView(props: {
  campaignTitle: string;
  amount: number;
  custom: string;
  anonymous: boolean;
  paymentMethod: PaymentMethod;
  effective: number;
  phase: Phase;
  message: string;
  setAmount: (n: number) => void;
  setCustom: (s: string) => void;
  setAnonymous: (v: boolean | ((v: boolean) => boolean)) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const {
    campaignTitle,
    amount,
    custom,
    anonymous,
    paymentMethod,
    effective,
    phase,
    message,
    setAmount,
    setCustom,
    setAnonymous,
    setPaymentMethod,
    onSubmit,
    onClose,
  } = props;
  return (
    <>
      <h3 className="display-md text-2xl">Contribute</h3>
      <p className="mt-1 text-sm text-body">
        to <span className="font-semibold text-ink">{campaignTitle}</span>
      </p>

      <p className="mt-5 text-[13px] font-semibold text-ink">Amount (NGN)</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {AMOUNT_PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setAmount(preset);
              setCustom("");
            }}
            className={`h-12 rounded-md border text-sm font-bold transition-all ${
              !custom && amount === preset
                ? "border-ink bg-ink text-white"
                : "border-hairline bg-white text-ink hover:border-ink/50"
            }`}
          >
            {naira(preset)}
          </button>
        ))}
      </div>
      <input
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        inputMode="decimal"
        placeholder="Or enter a custom amount"
        className="mt-2 h-12 w-full rounded-md border border-hairline bg-white px-4 text-sm placeholder:text-muted focus:border-ink/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
      />

      <p className="mt-5 text-[13px] font-semibold text-ink">Payment method</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(
          [
            ["bank_transfer", "Bank transfer"],
            ["card", "Card"],
          ] as Array<[PaymentMethod, string]>
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setPaymentMethod(value)}
            className={`h-12 rounded-md border text-sm font-bold transition-all ${
              paymentMethod === value
                ? "border-ink bg-ink text-white"
                : "border-hairline bg-white text-ink hover:border-ink/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setAnonymous((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-md border border-hairline bg-soft px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-bold">Contribute anonymously</span>
          <span className="block text-[13px] text-body">
            Your name stays hidden on the public page
          </span>
        </span>
        <span
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            anonymous ? "bg-ink" : "bg-ink/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              anonymous ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
      </button>

      {phase === "error" && (
        <p className="mt-4 rounded-md border border-danger/20 bg-[#FDECEC] px-3.5 py-2.5 text-sm font-medium text-danger">
          {message}
        </p>
      )}

      <Button className="mt-5 w-full" size="lg" disabled={phase === "confirming"} onClick={onSubmit}>
        {phase === "confirming" ? (
          <>
            <Spinner /> Confirming with Kora…
          </>
        ) : (
          <>Contribute {naira(effective || 0)}</>
        )}
      </Button>
      <button
        onClick={onClose}
        className="mt-3 w-full text-center text-sm font-medium text-body hover:text-ink"
      >
        Cancel
      </button>
    </>
  );
}

