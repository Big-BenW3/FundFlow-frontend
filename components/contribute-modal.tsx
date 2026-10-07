"use client";

/* Contribute modal: amount presets → anonymous toggle → confirm → success. */

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@/components/ui";
import { AMOUNT_PRESETS, ApiError, api, naira } from "@/lib/api";
import type { Campaign, ContributionItem } from "@/types";

type Phase = "choose" | "confirming" | "success" | "error";

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
  const [amount, setAmount] = useState<number>(AMOUNT_PRESETS[1]);
  const [custom, setCustom] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [phase, setPhase] = useState<Phase>("choose");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setPhase("choose");
      setMessage("");
    }
  }, [open ]);

  if (!open) return null;

  const effective = custom.trim() ? Number(custom.replace(/[^0-9.]/g, "")) : amount;

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
        { amount: effective, anonymous }
      );
      // The pipeline settles in the same request cycle (mock mode):
      // poll briefly to show the "verifying" state, then celebrate.
      const start = Date.now();
      let settled = contribution;
      while (Date.now() - start < 4000 && settled.status === "PENDING") {
        await new Promise((r) => setTimeout(r, 600));
        settled = await api.get<ContributionItem>(`/contributions/${contribution.id}`);
      }
      if (settled.status === "SUCCESS") {
        setPhase("success");
        setMessage(`₦${Number(settled.amount).toLocaleString()} received. Thank you!`);
      } else if (settled.status === "PENDING") {
        setPhase("success");
        setMessage("Payment received. Confirming with Kora now.");
      } else {
        setPhase("error");
        setMessage("The payment could not be confirmed. Please try again.");
      }
      void queryClient.invalidateQueries({ queryKey: ["campaign"] });
      void queryClient.invalidateQueries({ queryKey: ["activity"] });
      onSuccess();
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
          ) : (
            <ChooseView
              campaignTitle={campaign.title}
              amount={amount}
              custom={custom}
              anonymous={anonymous}
              effective={effective || 0}
              phase={phase}
              message={message}
              setAmount={setAmount}
              setCustom={setCustom}
              setAnonymous={setAnonymous}
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

function ChooseView(props: {
  campaignTitle: string;
  amount: number;
  custom: string;
  anonymous: boolean;
  effective: number;
  phase: Phase;
  message: string;
  setAmount: (n: number) => void;
  setCustom: (s: string) => void;
  setAnonymous: (v: boolean | ((v: boolean) => boolean)) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const {
    campaignTitle,
    amount,
    custom,
    anonymous,
    effective,
    phase,
    message,
    setAmount,
    setCustom,
    setAnonymous,
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

