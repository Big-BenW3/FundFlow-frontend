"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { Campaign, CampaignStats, OwnerRef } from "@/types";
import { Progress } from "@/components/ui";
import { Badge } from "@/components/ui";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23F3F4F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='24' fill='%239CA3AF'%3ECampaign image%3C/text%3E%3C/svg%3E";

function ownerName(campaign: Campaign): string {
  if (typeof campaign.owner === "string") return campaign.owner;
  return (campaign.owner as OwnerRef)?.name || "Unknown";
}

interface CampaignCardProps {
  campaign: Campaign;
  stats?: CampaignStats;
  large?: boolean;
}

export default function CampaignCard({ campaign, large = false }: CampaignCardProps) {
  const name = ownerName(campaign);
  const raised = campaign.raised_amount?.toLocaleString("en-NG") ?? "0";
  const target = campaign.target_amount?.toLocaleString("en-NG") ?? "0";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-hairline bg-card shadow-sm transition-transform duration-200 ease-out hover-lift ${
        large ? "md:col-span-2" : ""
      }`}
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.cover_image || PLACEHOLDER_SVG}
          alt={campaign.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge tone="dark" className="bg-black/40 text-white">
            {campaign.category}
          </Badge>
          <span className="text-white font-semibold text-sm bg-black/40 px-3 py-1 rounded-full">
            by {name}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-white font-bold text-lg">{campaign.progress}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-ink line-clamp-2 mb-2">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="hover:text-ink transition-colors"
          >
            {campaign.title}
          </Link>
        </h3>

        <p className="text-sm text-body line-clamp-2 mb-4">
          {campaign.short_description || "Supporting story coming soon."}
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted">{raised} / {target}</span>
            <span className="font-semibold text-ink">{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Deadline: {campaign.deadline || "No deadline"}</span>
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="font-medium hover:text-ink"
          >
            View campaign
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CampaignCardLarge({ campaign }: { campaign: Campaign }) {
  const name = ownerName(campaign);
  return (
    <div
      className="bg-card border border-hairline rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.cover_image || PLACEHOLDER_SVG}
          alt={campaign.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center" />
        <div className="absolute top-3 left-3">
          <Badge tone="dark" className="bg-black/40 text-white">
            {campaign.category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-white font-bold text-lg">{campaign.progress}%</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-ink mb-2">
          <Link href={`/campaigns/${campaign.slug}`} className="hover:text-ink transition-colors">
            {campaign.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {campaign.description || campaign.short_description || ""}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Raised</p>
            <p className="text-lg font-semibold text-ink">{raisedAmount(campaign)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Target</p>
            <p className="text-lg font-semibold text-ink">{targetAmount(campaign)}</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={campaign.progress} className="h-2" />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Deadline: {campaign.deadline || "No deadline"}</span>
          <span className="font-medium text-ink">by {name}</span>
        </div>
      </div>
    </div>
  );
}

function raisedAmount(campaign: Campaign): string {
  return campaign.raised_amount?.toLocaleString("en-NG") ?? "0";
}

function targetAmount(campaign: Campaign): string {
  return campaign.target_amount?.toLocaleString("en-NG") ?? "0";
}
