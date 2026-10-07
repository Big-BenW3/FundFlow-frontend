"use client";

/* Campaign hero: cover, progress, collection account (part of campaign page). */

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Progress,
  Skeleton,
} from "@/components/ui";
import { formatDate, naira, timeLeft } from "@/lib/api";
import type { Campaign, CampaignStats } from "@/types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80";

type Props =
  | { state: "loading" }
  | { state: "missing" }
  | {
      state: "ready";
      campaign: Campaign;
      stats: CampaignStats;
      isOwner: boolean;
      onContribute: () => void;
    };

export default function CampaignHero(props: Props) {
  if (props.state === "loading") return <LoadingHero />;
  if (props.state === "missing") return <MissingHero />;

  const { campaign, stats, isOwner, onContribute } = props;
  return (
    <div className="relative overflow-hidden border-b border-hairline bg-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={campaign.cover_image || FALLBACK_COVER}
        alt={campaign.title}
        className="h-56 w-full object-cover sm:h-72"
      />
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="voltage">{campaign.category}</Badge>
          <Badge>{campaign.visibility}</Badge>
          {campaign.is_diaspora && <Badge tone="info">Diaspora</Badge>}
        </div>
        <h1 className="display-lg mt-4 max-w-3xl text-3xl sm:text-5xl">{campaign.title}</h1>
        <p className="mt-2 text-sm text-body">
          by <span className="font-semibold text-ink">{campaign.owner.name}</span>
          {" · "}
          {timeLeft(campaign.deadline)}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="rise-in">
            <ProgressCard stats={stats} campaign={campaign} isOwner={isOwner} onContribute={onContribute} />
          </Card>
          <Card className="rise-in rise-in-1">
            <CollectionCard campaign={campaign} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoadingHero() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Skeleton className="aspect-[21/9] w-full" />
      <Skeleton className="mt-6 h-10 w-2/3" />
      <Skeleton className="mt-3 h-5 w-1/3" />
    </div>
  );
}

function MissingHero() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <EmptyState
        title="Campaign not found"
        body="It may be private, cancelled, or the link is wrong."
        action={
          <Link href="/campaigns">
            <Button>Browse campaigns</Button>
          </Link>
        }
      />
    </div>
  );
}

function ProgressCard({
  stats,
  campaign,
  isOwner,
  onContribute,
}: {
  stats: CampaignStats;
  campaign: Campaign;
  isOwner: boolean;
  onContribute: () => void;
}) {
  return (
    <CardContent>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="stat-pop text-4xl font-extrabold tracking-tight sm:text-5xl">
            {naira(stats.raised)}
          </p>
          <p className="mt-1 text-sm text-body">
            raised of <span className="font-semibold text-ink">{naira(stats.target)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold tracking-tight">{stats.progress.toFixed(1)}%</p>
          <p className="text-sm text-body">{stats.contributors} contributors</p>
        </div>
      </div>
      <Progress value={stats.progress} className="mt-4 h-3" />
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md bg-soft px-2 py-3">
          <p className="text-[15px] font-extrabold">{naira(stats.disbursed)}</p>
          <p className="text-xs text-muted">Disbursed</p>
        </div>
        <div className="rounded-md bg-soft px-2 py-3">
          <p className="text-[15px] font-extrabold">{naira(stats.available)}</p>
          <p className="text-xs text-muted">Available</p>
        </div>
        <div className="rounded-md bg-soft px-2 py-3">
          <p className="text-[15px] font-extrabold">
            {campaign.deadline ? formatDate(campaign.deadline) : "TBD"}
          </p>
          <p className="text-xs text-muted">Deadline</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="lg" className="flex-1" onClick={onContribute}>
          Contribute
        </Button>
        {isOwner && (
          <Link href={`/dashboard/${campaign.id}`}>
            <Button variant="dark" size="lg">
              Manage
            </Button>
          </Link>
        )}
      </div>
    </CardContent>
  );
}

function CollectionCard({ campaign }: { campaign: Campaign }) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-base">Collection account</CardTitle>
      </CardHeader>
      <CardContent className="!pt-2">
        <p className="text-[13px] text-body">
          Contributions go to this Kora virtual account for the campaign.
        </p>
        <div className="mt-3 rounded-md border border-hairline bg-soft p-3.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            {campaign.account?.bank_name ?? "Account"}
          </p>
          <p className="mt-1 text-xl font-extrabold tracking-wide">
            {campaign.account?.account_number ?? "Pending"}
          </p>
          <p className="mt-1 break-all font-mono text-xs text-body">
            ref: {campaign.account?.account_reference ?? "pending"}
          </p>
        </div>
        <p className="mt-3 text-[13px] text-body">
          Bank transfer is the fastest way in. Web contributions confirm here
          automatically.
        </p>
      </CardContent>
    </>
  );
}

