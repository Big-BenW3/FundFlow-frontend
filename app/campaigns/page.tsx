"use client";

/* Campaign directory: search + category filters + grid. */

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import CampaignCard from "@/components/campaign-card";
import { EmptyState, Skeleton } from "@/components/ui";
import { CATEGORIES, api } from "@/lib/api";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const params = new URLSearchParams({ limit: "60" });
  if (category) params.set("category", category);
  if (search.trim()) params.set("q", search.trim());

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", search.trim(), category],
    queryFn: () => api.get<Campaign[]>(`/campaigns?${params.toString()}`),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-muted">Explore</p>
      <h1 className="display-md mt-2 text-3xl sm:text-5xl">Campaigns raising now</h1>
      <p className="mt-3 max-w-xl text-[15px] text-body">
        Every campaign shows its goal, ledger-backed progress and payout plan
        up front. No blind trust required.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns…"
          className="h-11 flex-1 rounded-md border border-hairline bg-white px-4 text-sm placeholder:text-muted focus:border-ink/60 focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-md border border-hairline bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="aspect-[16/10] w-full" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState
            title="No campaigns found"
            body="Try a different search, or start the first campaign yourself."
            action={
              <Link
                href="/create"
                className="inline-flex h-11 items-center rounded-md bg-voltage px-5 text-sm font-semibold text-ink"
              >
                Start a campaign
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
