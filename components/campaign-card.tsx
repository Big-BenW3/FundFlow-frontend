"use client"

import Link from "next/link"
import { Button } from "@/components/ui"
import { Campaign, CampaignStats, OwnerRef } from "@/types"
import { Progress } from "@/components/ui"
import { Badge } from "@/components/ui"

interface CampaignCardProps {
  campaign: Campaign
  stats?: CampaignStats
  large?: boolean
}

export default function CampaignCard({ campaign, large = false }: CampaignCardProps) {
  const isPrivate = campaign.visibility === "PRIVATE"
  const ownerName = typeof campaign.owner === 'string' ? campaign.owner : (campaign.owner as OwnerRef)?.name || 'Unknown'

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        large ? "md:col-span-2" : ""
      }`}
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.cover_image || '/placeholder-campaign.jpg'}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {isPrivate && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-white/20 px-3 py-1 rounded-full">
              Private Campaign
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge
            tone="dark"
            className="bg-black/40 text-white"
          >
            {campaign.category}
          </Badge>
          {ownerName && (
            <Badge
              tone="dark"
              className="bg-black/40 text-white"
            >
              by {ownerName}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 mb-2">
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="hover:text-primary transition-colors"
          >
            {campaign.title}
          </Link>
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {campaign.short_description || "Supporting story coming soon..."}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">
              {campaign.raised_amount.toLocaleString("en-NG")} /{" "}
              {campaign.target_amount.toLocaleString("en-NG")}
            </span>
            <span className="font-medium text-foreground">{campaign.progress}%</span>
          </div>
          <Progress
            value={campaign.progress}
            className="h-2"
          />
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Deadline: {campaign.deadline || 'No deadline'}</span>
          <Link
            href={`/campaigns/${campaign.slug}`}
            className="font-medium text-primary hover:underline"
          >
            View campaign →
          </Link>
        </div>
      </div>
    </div>
  )
}

interface CampaignCardLargeProps {
  campaign: Campaign
  onClick?: () => void
}

export function CampaignCardLarge({ campaign, onClick }: CampaignCardLargeProps) {
  const isPrivate = campaign.visibility === "PRIVATE"
  const ownerName = typeof campaign.owner === 'string' ? campaign.owner : (campaign.owner as OwnerRef)?.name || 'Unknown'
  return (
    <div
      className="bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={campaign.cover_image || '/placeholder-campaign.jpg'} alt={campaign.title} className="w-full h-full object-cover" />
        {isPrivate && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-white/20 px-3 py-1 rounded-full">Private</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge tone="dark" className="bg-black/40 text-white">{campaign.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-white font-bold text-lg">{campaign.progress}%</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          <Link href={`/campaigns/${campaign.slug}`} className="hover:text-primary transition-colors">{campaign.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{campaign.description || ''}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Raised</p>
            <p className="text-lg font-semibold text-card-foreground">{campaign.raised_amount.toLocaleString("en-NG")}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Target</p>
            <p className="text-lg font-semibold text-card-foreground">{campaign.target_amount.toLocaleString("en-NG")}</p>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={campaign.progress} className="h-2" />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Deadline: {campaign.deadline || 'No deadline'}</span>
          <span className="font-medium text-primary">by {ownerName}</span>
        </div>
      </div>
    </div>
  )
}
