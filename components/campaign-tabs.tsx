"use client";

/* Campaign detail tabs: financial plan, milestones, activity, updates. */

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState, Progress, Skeleton } from "@/components/ui";
import { api, formatDate, formatDateTime, naira } from "@/lib/api";
import type {
  CampaignUpdate,
  ContributionItem,
  Milestone,
  Payout,
  PayoutRule,
} from "@/types";

export const STATUS_TONE: Record<
  string,
  "success" | "warning" | "info" | "default" | "dark" | "danger"
> = {
  SUCCESS: "success",
  FAILED: "danger",
  PENDING: "warning",
  PROCESSING: "info",
  UNKNOWN: "warning",
  READY: "info",
  APPROVED: "info",
  PAID: "success",
  LOCKED: "warning",
  DRAFT: "default",
  TRIGGERED: "info",
  EXECUTED: "success",
  VERIFIED: "success",
};

/* ------------------------- Financial plan ("Where does the money go?") ------------------------- */

export function PlanTab({ campaignId, currency }: { campaignId: number; currency: string }) {
  const rulesQuery = useQuery({
    queryKey: ["rules", campaignId],
    queryFn: () => api.get<PayoutRule[]>(`/campaigns/${campaignId}/payout-rules`),
  });
  const milestonesQuery = useQuery({
    queryKey: ["milestones", campaignId],
    queryFn: () => api.get<Milestone[]>(`/campaigns/${campaignId}/milestones`),
  });

  if (rulesQuery.isLoading) return <Skeleton className="h-48 w-full" />;
  const rules = rulesQuery.data ?? [];
  const milestones = milestonesQuery.data ?? [];

  const rows = rules.length > 0 ? rules : milestones;

  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight">Where does the money go?</h2>
      <p className="mt-1 text-sm text-body">
        The planned flow of funds: who receives what, and under which conditions.
      </p>
      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No payout plan yet"
            body="The campaign owner hasn't published the disbursement plan."
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-hairline bg-soft text-[13px] text-muted">
                  <th className="px-5 py-3 font-semibold">Recipient</th>
                  <th className="px-5 py-3 font-semibold">Purpose</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Trigger</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const isRule = "trigger_type" in row && !("beneficiary_id" in row && "order_index" in row);
                  const label = isRule
                    ? (row as PayoutRule).label ?? (row as PayoutRule).trigger_type
                    : (row as Milestone).name;
                  const amount = isRule
                    ? ((row as PayoutRule).amount ?? 0)
                    : (row as Milestone).amount;
                  const trigger = isRule
                    ? (row as PayoutRule).trigger_type.replace("_", " ")
                    : `Milestone ${index + 1}`;
                  const status = isRule ? (row as PayoutRule).status : (row as Milestone).status;
                  const recipient = isRule
                    ? ((row as PayoutRule).beneficiary?.name ?? "Unassigned")
                    : ((row as Milestone).beneficiary?.name ?? "Unassigned");
                  return (
                    <tr key={index} className="border-b border-hairline last:border-0">
                      <td className="px-5 py-3.5 font-semibold">{recipient}</td>
                      <td className="px-5 py-3.5 text-body">{label}</td>
                      <td className="px-5 py-3.5 text-right font-extrabold">
                        {naira(amount)}
                      </td>
                      <td className="px-5 py-3.5 text-body">{trigger}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={STATUS_TONE[status] ?? "default"}>{status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <p className="mt-3 font-mono text-xs text-muted">
        All amounts in {currency}. Payouts only execute when the stated conditions hold.
      </p>
    </div>
  );
}

/* ------------------------------ Milestones tab ------------------------------ */

const MILESTONE_STATE_COPY: Record<
  string,
  { label: string; tone: "success" | "info" | "warning" | "default" }
> = {
  PAID: { label: "Completed · paid", tone: "success" },
  APPROVED: { label: "Approved · payout live", tone: "info" },
  READY: { label: "Ready for approval", tone: "info" },
  PENDING: { label: "Not started", tone: "default" },
};

export function MilestonesTab({
  milestones,
  loading,
}: {
  milestones: Milestone[];
  loading: boolean;
}) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (milestones.length === 0) {
    return (
      <EmptyState
        title="No milestones yet"
        body="The owner hasn't defined staged releases for this campaign."
      />
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {milestones.map((milestone, index) => {
        const copy =
          MILESTONE_STATE_COPY[milestone.state] ??
          MILESTONE_STATE_COPY[milestone.status] ?? {
            label: milestone.status,
            tone: "default" as const,
          };
        const percent =
          milestone.status === "PAID" ? 100 : milestone.status === "APPROVED" ? 66 : 0;
        return (
          <Card key={milestone.id}>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-extrabold text-white">
                    {index + 1}
                  </span>
                  <p className="text-base font-extrabold tracking-tight">{milestone.name}</p>
                  <Badge tone={copy.tone}>{copy.label}</Badge>
                </div>
                {milestone.description && (
                  <p className="mt-1.5 text-sm text-body">{milestone.description}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <Progress value={percent} className="max-w-xs" />
                  <span className="text-[13px] font-bold">{percent}%</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-extrabold tracking-tight">{naira(milestone.amount)}</p>
                {milestone.beneficiary && (
                  <p className="mt-1 text-[13px] text-body">→ {milestone.beneficiary.name}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ------------------------------- Activity tab ------------------------------- */

export function ActivityTab({
  contributions,
  payouts,
  currency,
  loading,
}: {
  contributions: ContributionItem[];
  payouts: Payout[];
  currency: string;
  loading: boolean;
}) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="text-base font-extrabold tracking-tight">Contributions</h3>
        <div className="mt-4 flex flex-col gap-2.5">
          {contributions.length === 0 && (
            <p className="text-sm text-body">No contributions yet. Be the first.</p>
          )}
          {contributions.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-md border border-hairline bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold">{c.contributor.name ?? "Someone"}</p>
                <p className="text-[13px] text-muted">{formatDateTime(c.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold">{naira(c.amount)}</p>
                <Badge tone={STATUS_TONE[c.status] ?? "default"}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-base font-extrabold tracking-tight">Payout history</h3>
        <div className="mt-4 flex flex-col gap-2.5">
          {payouts.length === 0 && (
            <p className="text-sm text-body">No payouts yet. Funds release when rules are met.</p>
          )}
          {payouts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md border border-hairline bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold">
                  {p.status === "SUCCESS" ? "✓ " : p.status === "FAILED" ? "✕ " : "… "}
                  {naira(p.amount)} → {p.beneficiary?.name ?? "beneficiary"}
                </p>
                <p className="text-[13px] text-muted">
                  {p.milestone_name ?? "Payout"} · {formatDateTime(p.completed_at ?? p.created_at)}
                </p>
              </div>
              <Badge tone={STATUS_TONE[p.status] ?? "default"}>{p.status}</Badge>
            </div>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-muted">
          Payouts settle in {currency} through Kora bank transfer.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- Updates tab ------------------------------- */

export function UpdatesTab({
  updates,
  loading,
}: {
  updates: CampaignUpdate[];
  loading: boolean;
}) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (updates.length === 0) {
    return (
      <EmptyState
        title="No updates yet"
        body="Progress updates from the campaign owner will appear here."
      />
    );
  }
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      {updates.map((update) => (
        <Card key={update.id}>
          <CardHeader>
            <CardTitle>{update.title}</CardTitle>
            <p className="text-[13px] text-muted">{formatDateTime(update.created_at)}</p>
          </CardHeader>
          <CardContent className="!pt-1">
            <p className="text-[15px] leading-relaxed text-body">{update.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


