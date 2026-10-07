"use client";

/* Public campaign page — the heart of the product (§15-17, §28). */

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ContributeModal from "@/components/contribute-modal";
import { Badge, Button } from "@/components/ui";
import { useAuth } from "@/components/auth-provider";
import { timeLeft } from "@/lib/api";
import { useActivity, useCampaign, useMilestones, useUpdates } from "@/lib/queries";
import { ActivityTab, MilestonesTab, PlanTab, UpdatesTab } from "@/components/campaign-tabs";
import CampaignHero from "@/components/campaign-hero";

type Tab = "plan" | "milestones" | "activity" | "updates";

export default function CampaignPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("plan");
  const [contributeOpen, setContributeOpen] = useState(false);

  const campaignQuery = useCampaign(slug);
  const campaign = campaignQuery.data;
  const activityQuery = useActivity(campaign?.id ?? null);
  const milestonesQuery = useMilestones(campaign?.id ?? null);
  const updatesQuery = useUpdates(campaign?.id ?? null);

  function refresh() {
    if (!campaign) return;
    void queryClient.invalidateQueries({ queryKey: ["campaign", slug] });
    void queryClient.invalidateQueries({ queryKey: ["activity", campaign.id] });
    void queryClient.invalidateQueries({ queryKey: ["milestones", campaign.id] });
  }

  if (campaignQuery.isLoading || campaignQuery.isError || !campaign) {
    return (
      <CampaignHero
        state={
          campaignQuery.isLoading ? "loading" : "missing"
        }
      />
    );
  }

  const stats = campaign.stats!;
  const isOwner = user != null && user.id === campaign.owner.id;

  return (
    <div>
      <CampaignHero
        state="ready"
        campaign={campaign}
        stats={stats}
        isOwner={isOwner}
        onContribute={() => {
          if (!user) router.push("/auth/login");
          else setContributeOpen(true);
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex gap-2 overflow-x-auto border-b border-hairline">
          {(
            [
              ["plan", "Financial plan"],
              ["milestones", "Milestones"],
              ["activity", "Activity"],
              ["updates", "Updates"],
            ] as Array<[Tab, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === key
                  ? "border-ink text-ink"
                  : "border-transparent text-body hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "plan" && <PlanTab campaignId={campaign.id} currency={campaign.currency} />}
          {tab === "milestones" && (
            <MilestonesTab
              milestones={milestonesQuery.data ?? []}
              loading={milestonesQuery.isLoading}
            />
          )}
          {tab === "activity" && (
            <ActivityTab
              contributions={activityQuery.data?.contributions ?? []}
              payouts={activityQuery.data?.payouts ?? []}
              currency={campaign.currency}
              loading={activityQuery.isLoading}
            />
          )}
          {tab === "updates" && (
            <UpdatesTab updates={updatesQuery.data ?? []} loading={updatesQuery.isLoading} />
          )}
        </div>
      </div>

      <ContributeModal
        open={contributeOpen}
        campaign={campaign}
        onClose={() => setContributeOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
}


