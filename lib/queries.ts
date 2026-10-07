// Reusable query hooks.

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AppNotification,
  Campaign,
  CampaignUpdate,
  ContributionItem,
  LedgerEntry,
  Member,
  Milestone,
  Payout,
} from "@/types";

export function useCampaign(slugOrId: string) {
  return useQuery({
    queryKey: ["campaign", slugOrId],
    queryFn: () => api.get<Campaign>(`/campaigns/slug/${slugOrId}`),
    enabled: !!slugOrId,
  });
}

export function useCampaignById(id: number | null) {
  return useQuery({
    queryKey: ["campaign-id", id],
    queryFn: () => api.get<Campaign>(`/campaigns/${id}`),
    enabled: id != null,
  });
}

export function useActivity(campaignId: number | null) {
  return useQuery({
    queryKey: ["activity", campaignId],
    queryFn: () =>
      api.get<{ contributions: ContributionItem[]; payouts: Payout[]; ledger: LedgerEntry[] }>(
        `/campaigns/${campaignId}/activity`
      ),
    enabled: campaignId != null,
  });
}

export function useMilestones(campaignId: number | null) {
  return useQuery({
    queryKey: ["milestones", campaignId],
    queryFn: () => api.get<Milestone[]>(`/campaigns/${campaignId}/milestones`),
    enabled: campaignId != null,
  });
}

export function useUpdates(campaignId: number | null) {
  return useQuery({
    queryKey: ["updates", campaignId],
    queryFn: () => api.get<CampaignUpdate[]>(`/campaigns/${campaignId}/updates`),
    enabled: campaignId != null,
  });
}

export function useContributions(campaignId: number | null) {
  return useQuery({
    queryKey: ["contributions", campaignId],
    queryFn: () => api.get<ContributionItem[]>(`/campaigns/${campaignId}/contributions`),
    enabled: campaignId != null,
  });
}

export function useMembers(campaignId: number | null) {
  return useQuery({
    queryKey: ["members", campaignId],
    queryFn: () => api.get<Member[]>(`/campaigns/${campaignId}/members`),
    enabled: campaignId != null,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<AppNotification[]>("/notifications"),
    refetchInterval: 30_000,
  });
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () =>
      api.get<{
        campaigns: { campaign: Campaign; stats: Campaign["stats"] }[];
        totals: { campaigns: number; raised: number; disbursed: number; contributors: number };
        unread_notifications: number;
      }>("/dashboard/overview"),
  });
}
