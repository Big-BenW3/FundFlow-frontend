"use client";

/* Campaign manage dashboard (§31-37). */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, Progress, Skeleton } from "@/components/ui";
import { Input, Textarea } from "@/components/forms";
import { useAuth } from "@/components/auth-provider";
import { ApiError, api, formatDateTime, naira } from "@/lib/api";
import { useCampaignById, useContributions, useMilestones, useMembers } from "@/lib/queries";
import type { AuditEntry, Beneficiary, CampaignUpdate, Payout } from "@/types";

const STATUS_TONE: Record<string, "success" | "warning" | "info" | "default" | "dark" | "danger"> = {
  SUCCESS: "success", FAILED: "danger", PENDING: "warning", PROCESSING: "info",
  UNKNOWN: "warning", READY: "info", APPROVED: "info", PAID: "success",
  LOCKED: "warning", DRAFT: "default", VERIFIED: "success",
};

type Tab = "overview" | "contributions" | "milestones" | "payouts" | "beneficiaries" | "updates" | "members" | "audit";

export default function CampaignManagePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const campaignId = Number(params.id);
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) || "overview");

  const campaignQuery = useCampaignById(campaignId);
  const campaign = campaignQuery.data;

  if (campaignQuery.isLoading) return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><Skeleton className="h-64 w-full" /></div>;
  if (campaignQuery.isError || !campaign) return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><EmptyState title="Campaign not found" /></div>;

  const isOwner = user != null && (user.id === campaign.owner.id || user.role === "ADMIN");
  if (!isOwner) return <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6"><EmptyState title="Access denied" body="Only owners and admins can manage this campaign." /></div>;

  const tabs: Array<[Tab, string]> = [
    ["overview", "Overview"], ["contributions", "Contributions"], ["milestones", "Milestones"],
    ["payouts", "Payouts"], ["beneficiaries", "Beneficiaries"], ["updates", "Updates"],
    ["members", "Members"], ["audit", "Audit Log"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="eyebrow text-muted">Campaign manage</p>
          <h1 className="display-md mt-2 text-3xl sm:text-4xl">{campaign.title}</h1>
          <div className="mt-2 flex gap-2">
            <Badge tone={campaign.status === "ACTIVE" ? "success" : "warning"}>{campaign.status}</Badge>
            <Badge>{campaign.visibility}</Badge>
          </div>
        </div>
        <a href={`/campaigns/${campaign.slug}`} target="_blank"><Button variant="outline">View public page →</Button></a>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-hairline">
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); router.push(`/dashboard/${campaignId}?tab=${key}`, { scroll: false }); }}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${tab === key ? "border-ink text-ink" : "border-transparent text-body hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab campaignId={campaignId} />}
        {tab === "contributions" && <ContributionsTab campaignId={campaignId} />}
        {tab === "milestones" && <MilestonesTab campaignId={campaignId} />}
        {tab === "payouts" && <PayoutsTab campaignId={campaignId} />}
        {tab === "beneficiaries" && <BeneficiariesTab campaignId={campaignId} />}
        {tab === "updates" && <UpdatesTab campaignId={campaignId} />}
        {tab === "members" && <MembersTab campaignId={campaignId} />}
        {tab === "audit" && <AuditTab campaignId={campaignId} />}
      </div>
    </div>
  );
}

/* ------------------------------ Overview Tab ------------------------------- */

function OverviewTab({ campaignId }: { campaignId: number }) {
  const { data: campaign } = useCampaignById(campaignId);
  if (!campaign) return <Skeleton className="h-64 w-full" />;
  const stats = campaign.stats!;
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card><CardContent className="text-center py-4"><p className="text-2xl font-extrabold">{naira(stats.raised)}</p><p className="mt-1 text-xs font-medium text-muted uppercase">Raised</p></CardContent></Card>
      <Card><CardContent className="text-center py-4"><p className="text-2xl font-extrabold">{naira(stats.disbursed)}</p><p className="mt-1 text-xs font-medium text-muted uppercase">Disbursed</p></CardContent></Card>
      <Card><CardContent className="text-center py-4"><p className="text-2xl font-extrabold">{naira(stats.available)}</p><p className="mt-1 text-xs font-medium text-muted uppercase">Available</p></CardContent></Card>
      <Card><CardContent className="text-center py-4"><p className="text-2xl font-extrabold">{stats.contributors}</p><p className="mt-1 text-xs font-medium text-muted uppercase">Contributors</p></CardContent></Card>
      <div className="md:col-span-4"><Progress value={stats.progress} className="h-3" /><p className="mt-2 text-sm text-body">{stats.progress.toFixed(1)}% of {naira(stats.target)}</p></div>
    </div>
  );
}

/* --------------------------- Contributions Tab ---------------------------- */

function ContributionsTab({ campaignId }: { campaignId: number }) {
  const query = useContributions(campaignId);
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  if (rows.length === 0) return <EmptyState title="No contributions yet" />;
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-hairline bg-soft text-[13px] text-muted">
            <th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 font-semibold">Contributor</th>
            <th className="px-5 py-3 text-right font-semibold">Amount</th><th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold">Reference</th>
          </tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-hairline last:border-0">
                <td className="px-5 py-3.5 text-body">{formatDateTime(c.created_at)}</td>
                <td className="px-5 py-3.5 font-semibold">{c.contributor.name}{c.anonymous && <span className="ml-1 text-muted">(anon)</span>}</td>
                <td className="px-5 py-3.5 text-right font-extrabold">{naira(c.amount)}</td>
                <td className="px-5 py-3.5"><Badge tone={STATUS_TONE[c.status] ?? "default"}>{c.status}</Badge></td>
                <td className="px-5 py-3.5 font-mono text-xs text-muted">{c.kora_reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ------------------------------ Milestones Tab ----------------------------- */

function MilestonesTab({ campaignId }: { campaignId: number }) {
  const query = useMilestones(campaignId);
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  if (rows.length === 0) return <EmptyState title="No milestones yet" body="Create milestones to stage fund releases." />;
  return (
    <div className="flex flex-col gap-4">
      {rows.map((m, i) => (
        <Card key={m.id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-xs font-extrabold text-white">{i + 1}</span>
              <div>
                <p className="text-sm font-extrabold">{m.name}</p>
                <p className="text-xs text-muted">{m.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold">{naira(m.amount)}</span>
              <Badge tone={STATUS_TONE[m.status] ?? "default"}>{m.status}</Badge>
              {m.status === "PENDING" && (
                <ApproveMilestoneButton milestoneId={m.id} />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------- Payouts Tab ------------------------------- */

function PayoutsTab({ campaignId }: { campaignId: number }) {
  const query = useQuery({ queryKey: ["payouts", campaignId], queryFn: () => api.get<Payout[]>(`/campaigns/${campaignId}/payouts`) });
  const queryClient = useQueryClient();
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  if (rows.length === 0) return <EmptyState title="No payouts yet" body="Approve milestones to create payouts." />;
  return (
    <div className="flex flex-col gap-3">
      {rows.map((p) => (
        <Card key={p.id}>
          <CardContent className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold">{naira(p.amount)} → {p.beneficiary?.name}</p>
              <p className="text-xs text-muted">{p.milestone_name ?? "Payout"} · {p.kora_reference}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={STATUS_TONE[p.status] ?? "default"}>{p.status}</Badge>
              {p.status === "READY" && <ExecutePayoutButton payoutId={p.id} />}
              {p.status === "DRAFT" && <ApprovePayoutButton payoutId={p.id} />}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExecutePayoutButton({ payoutId }: { payoutId: number }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Button size="sm" disabled={busy} onClick={async () => {
      setBusy(true);
      try { await api.post(`/payouts/${payoutId}/execute`); void queryClient.invalidateQueries(); } catch {} finally { setBusy(false); }
    }}>{busy ? "…" : "Execute"}</Button>
  );
}

function ApprovePayoutButton({ payoutId }: { payoutId: number }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Button size="sm" variant="outline" disabled={busy} onClick={async () => {
      setBusy(true);
      try { await api.post(`/payouts/${payoutId}/approve`); void queryClient.invalidateQueries(); } catch {} finally { setBusy(false); }
    }}>{busy ? "…" : "Approve"}</Button>
  );
}

function ApproveMilestoneButton({ milestoneId }: { milestoneId: number }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Button size="sm" disabled={busy} onClick={async () => {
      setBusy(true);
      try { await api.post(`/milestones/${milestoneId}/approve`); void queryClient.invalidateQueries(); } catch {} finally { setBusy(false); }
    }}>{busy ? "…" : "Approve"}</Button>
  );
}

/* ----------------------------- Beneficiaries Tab --------------------------- */

function BeneficiariesTab({ campaignId }: { campaignId: number }) {
  const query = useQuery({ queryKey: ["beneficiaries", campaignId], queryFn: () => api.get<Beneficiary[]>(`/campaigns/${campaignId}/beneficiaries`) });
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function addBeneficiary() {
    setError(""); setBusy(true);
    try {
      await api.post(`/campaigns/${campaignId}/beneficiaries`, { name, bank_code: bankCode, account_number: accountNumber });
      void queryClient.invalidateQueries({ queryKey: ["beneficiaries", campaignId] });
      setShowForm(false); setName(""); setBankCode(""); setAccountNumber("");
    } catch (e) { setError(e instanceof ApiError ? e.message : "Failed"); } finally { setBusy(false); }
  }

  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  return (
    <div>
      <div className="mb-4 flex justify-end"><Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add beneficiary"}</Button></div>
      {showForm && (
        <Card className="mb-4"><CardContent className="flex flex-col gap-3">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Bank Code" value={bankCode} onChange={e => setBankCode(e.target.value)} placeholder="033" />
          <Input label="Account Number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="1234567890" />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button disabled={busy || !name || !bankCode || !accountNumber} onClick={addBeneficiary}>{busy ? "Verifying…" : "Add & Verify"}</Button>
        </CardContent></Card>
      )}
      {rows.length === 0 ? <EmptyState title="No beneficiaries yet" /> : (
        <div className="flex flex-col gap-3">
          {rows.map((b) => (
            <Card key={b.id}><CardContent className="flex items-center justify-between">
              <div><p className="text-sm font-extrabold">{b.name}</p><p className="text-xs text-muted">{b.bank_name} · {b.account_number}</p></div>
              <Badge tone={STATUS_TONE[b.verification_status] ?? "default"}>{b.verification_status}</Badge>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Updates Tab ------------------------------- */

function UpdatesTab({ campaignId }: { campaignId: number }) {
  const query = useQuery({ queryKey: ["campaign-updates", campaignId], queryFn: () => api.get<CampaignUpdate[]>(`/campaigns/${campaignId}/updates`) });
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  async function postUpdate() {
    setBusy(true);
    try {
      await api.post(`/campaigns/${campaignId}/updates`, { title, body });
      void queryClient.invalidateQueries({ queryKey: ["campaign-updates", campaignId] });
      setShowForm(false); setTitle(""); setBody("");
    } catch {} finally { setBusy(false); }
  }

  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  return (
    <div>
      <div className="mb-4 flex justify-end"><Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Post update"}</Button></div>
      {showForm && (
        <Card className="mb-4"><CardContent className="flex flex-col gap-3">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea label="Body" value={body} onChange={e => setBody(e.target.value)} />
          <Button disabled={busy || !title} onClick={postUpdate}>{busy ? "Posting…" : "Post update"}</Button>
        </CardContent></Card>
      )}
      {rows.length === 0 ? <EmptyState title="No updates yet" /> : (
        <div className="flex flex-col gap-4">
          {rows.map(u => (
            <Card key={u.id}>
              <CardHeader>
                <CardTitle>{u.title}</CardTitle>
                <p className="text-xs text-muted">{formatDateTime(u.created_at)}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-body">{u.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Members Tab ------------------------------ */

function MembersTab({ campaignId }: { campaignId: number }) {
  const query = useMembers(campaignId);
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  if (rows.length === 0) return <EmptyState title="No members yet" />;
  return (
    <div className="flex flex-col gap-3">
      {rows.map(m => (
        <Card key={m.user_id}><CardContent className="flex items-center justify-between">
          <div><p className="text-sm font-extrabold">{m.name}</p><p className="text-xs text-muted">{m.email}</p></div>
          <Badge>{m.role}</Badge>
        </CardContent></Card>
      ))}
    </div>
  );
}

/* -------------------------------- Audit Tab -------------------------------- */

function AuditTab({ campaignId }: { campaignId: number }) {
  const query = useQuery({ queryKey: ["audit", campaignId], queryFn: () => api.get<AuditEntry[]>(`/campaigns/${campaignId}/audit`) });
  if (query.isLoading) return <Skeleton className="h-64 w-full" />;
  const rows = query.data ?? [];
  if (rows.length === 0) return <EmptyState title="No audit entries yet" />;
  return (
    <div className="flex flex-col gap-3">
      {rows.map(a => (
        <Card key={a.id}><CardContent className="flex items-start justify-between gap-4">
          <div><p className="text-sm font-semibold">{a.description}</p>{a.reference && <p className="text-xs font-mono text-muted">{a.reference}</p>}</div>
          <span className="whitespace-nowrap text-xs text-muted">{formatDateTime(a.created_at)}</span>
        </CardContent></Card>
      ))}
    </div>
  );
}