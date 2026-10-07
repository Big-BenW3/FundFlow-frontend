"use client";

/* Owner dashboard overview — all campaigns + stats (§31). */

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, CardContent, EmptyState, Progress, Skeleton } from "@/components/ui";
import { api, naira, timeLeft } from "@/lib/api";
import type { Campaign, CampaignStats } from "@/types";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => api.get<{
      campaigns: { campaign: Campaign; stats: Campaign["stats"] }[];
      totals: { campaigns: number; raised: number; disbursed: number; contributors: number };
      unread_notifications: number;
    }>("/dashboard/overview"),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 mb-8">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-6 w-1/6" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-4 h-3 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const { campaigns, totals, unread_notifications } = data ?? { campaigns: [], totals: { campaigns: 0, raised: 0, disbursed: 0, contributors: 0 }, unread_notifications: 0 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow text-muted">Owner dashboard</p>
          <h1 className="display-md mt-2 text-3xl sm:text-4xl">Your campaigns</h1>
        </div>
        <Link href="/create">
          <Button size="lg">New campaign</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-10">
        <StatCard label="Campaigns" value={totals.campaigns} tone="default" />
        <StatCard label="Total raised" value={naira(totals.raised)} tone="voltage" />
        <StatCard label="Disbursed" value={naira(totals.disbursed)} tone="success" />
        <StatCard label="Contributors" value={totals.contributors.toLocaleString()} tone="info" />
      </div>

      {unread_notifications > 0 && (
        <div className="mb-6 rounded-md border border-warning/30 bg-[#FFF6E5] px-4 py-3 text-sm font-medium text-warning">
          {unread_notifications} unread notification{unread_notifications > 1 ? "s" : ""}.{" "}
          <Link href="/dashboard?tab=notifications" className="font-semibold underline">view</Link>
        </div>
      )}

      <h2 className="text-xl font-extrabold tracking-tight mb-4">Campaigns</h2>

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          body="Start your first fundraiser. It takes a few minutes."
          action={<Link href="/create"><Button>Create campaign</Button></Link>}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((item: { campaign: Campaign; stats: CampaignStats | undefined }) => (
            <CampaignCard key={item.campaign.id} campaign={item.campaign} stats={item.stats} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone: "default" | "voltage" | "success" | "info" }) {
  const bg = {
    default: "bg-soft",
    voltage: "bg-voltage/10 border-voltage/20",
    success: "bg-[#E9F9EF] border-success/20",
    info: "bg-[#EAF1FE] border-info/20",
  }[tone];
  return (
    <Card className={bg}>
      <CardContent className="text-center py-4">
        <p className="text-2xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs font-medium text-muted uppercase">{label}</p>
      </CardContent>
    </Card>
  );
}

function CampaignCard({ campaign, stats }: { campaign: Campaign; stats?: CampaignStats }) {
  if (!stats) return null;
  return (
    <Link href={`/dashboard/${campaign.id}`} className="block">
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-pop">
        <div className="relative aspect-[16/10] overflow-hidden bg-soft">
          <img
            src={campaign.cover_image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-ink">{campaign.category}</span>
        </div>
        <CardContent>
          <h3 className="text-base font-extrabold tracking-tight line-clamp-2">{campaign.title}</h3>
          <p className="mt-1 text-[13px] text-muted">{timeLeft(campaign.deadline)}</p>
          <div className="mt-4">
            <Progress value={stats.progress} />
          </div>
          <div className="mt-3 flex items-baseline justify-between text-sm">
            <span className="font-bold">{naira(stats.raised)}</span>
            <span className="text-muted">of {naira(stats.target)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-hairline pt-3 text-[13px]">
            <span className="font-bold">{stats.progress.toFixed(1)}%</span>
            <span className="text-muted">{stats.contributors} contributors</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}