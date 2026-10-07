import Link from "next/link";
import CampaignCard from "@/components/campaign-card";
import { Faq } from "@/components/faq";
import { Button } from "@/components/ui";
import { API_URL } from "@/lib/api";
import type { Campaign } from "@/types";

async function featuredCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${API_URL}/campaigns?limit=3`, { next: { revalidate: 20 } });
    if (!res.ok) return [];
    return (await res.json()) as Campaign[];
  } catch {
    return [];
  }
}

const HOW_IT_WORKS = [
  ["Raise", "Open a campaign and get a dedicated Kora collection account automatically."],
  ["Track", "Every contribution lands in a public ledger with real time totals."],
  ["Govern", "Set milestones, approvals and payout rules before the first naira arrives."],
  ["Disburse", "Release funds to verified beneficiaries only when your rules are met."],
] as const;

const IMPACT_STORIES = [
  {
    quote:
      "The health centre foundation was cast on schedule because the money could only move when the milestone was approved. Donors watched it happen.",
    name: "Adaeze Okonkwo",
    detail: "Campaign owner, Orlu",
    campaign: "Build A Community Health Center",
    stat: "7.5M naira raised",
  },
  {
    quote:
      "I contributed from London and could see my transfer land in the public ledger the same day. That transparency is why I gave twice.",
    name: "Chidi Eze",
    detail: "Diaspora contributor",
    campaign: "Rebuild the Community Water System",
    stat: "2M naira given",
  },
  {
    quote:
      "Our borehole repair released funds in stages, so the installer only got paid after commissioning. No stories, just receipts.",
    name: "Fatima Bello",
    detail: "Community coordinator, Eke",
    campaign: "Rebuild the Community Water System",
    stat: "3,000 residents served",
  },
] as const;

const FAQS = [
  {
    q: "How does my contribution reach the campaign?",
    a: "Each campaign owns a dedicated Kora collection account. When you contribute by bank transfer or card, Kora notifies FundFlow with a signed webhook, we verify the transaction against Kora records, then credit the campaign ledger. Your contribution appears in the public activity feed.",
  },
  {
    q: "How do I know the money is spent correctly?",
    a: "Every campaign publishes a financial plan with milestones, beneficiaries and payout rules up front. Funds move only when those rules are met, and each release is recorded in the public ledger with the recipient, amount and time.",
  },
  {
    q: "Who receives the payouts?",
    a: "Beneficiaries are real bank accounts verified through Kora bank account resolution before any payout. A payout can only execute to a verified beneficiary, and only after its milestone is approved by the campaign owner.",
  },
  {
    q: "What happens if a campaign fails or is cancelled?",
    a: "Paused or cancelled campaigns stop accepting contributions immediately. Raised funds stay visible in the ledger, and refunds are processed back through Kora to the original contributors where applicable.",
  },
  {
    q: "Do I need a FundFlow account to contribute?",
    a: "No. Bank transfers to the campaign collection account work without an account. Signing in lets you track your giving history, get receipts, and manage your own campaigns.",
  },
  {
    q: "What does FundFlow charge?",
    a: "Campaign creation is free. Standard Kora processing applies per transaction, shown before you confirm. There are no hidden platform deductions from the campaign goal.",
  },
] as const;

export default async function HomePage() {
  const campaigns = await featuredCampaigns();

  return (
    <div>
      {/* --------------------------------- HERO --------------------------------- */}
      <section id="top" className="scroll-mt-20 border-b border-hairline bg-soft">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <h1 className="display-xl rise-in mt-2 max-w-3xl text-5xl sm:text-7xl">
            Raise money. Show where it goes. Release it by rule.
          </h1>
          <p className="rise-in rise-in-2 mt-6 max-w-xl text-lg text-body">
            FundFlow turns fundraising into a structured financial workflow:
            Kora-powered collection, an immutable campaign ledger, and payouts
            to verified beneficiaries, only when your rules are met.
          </p>
          <div className="rise-in rise-in-3 mt-8 flex flex-wrap gap-3">
            <Link href="/create">
              <Button size="lg">Start a campaign</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="dark" size="lg">
                Explore campaigns
              </Button>
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {HOW_IT_WORKS.map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-hairline bg-white p-6 shadow-card transition-shadow hover:shadow-pop"
              >
                <p className="text-lg font-extrabold tracking-tight">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ LIVE CAMPAIGNS --------------------------- */}
      <section id="campaigns" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted">Live campaigns</p>
            <h2 className="display-md mt-2 text-3xl sm:text-4xl">Raising right now</h2>
          </div>
          <Link href="/campaigns">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {campaigns.length === 0 ? (
            <p className="text-sm text-body">
              Campaigns will appear here once the API is running with demo data.
            </p>
          ) : (
            campaigns.map((campaign, index) => (
              <div key={campaign.id} className={`rise-in rise-in-${index + 1}`}>
                <CampaignCard campaign={campaign} large />
              </div>
            ))
          )}
        </div>
      </section>

      {/* ------------------------------ MONEY LOOP ------------------------------ */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-hairline bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="eyebrow text-voltage">How it works</p>
          <h2 className="display-md mt-2 max-w-2xl text-3xl sm:text-4xl">
            Kora is not our checkout, it is the financial lifecycle.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Collection infrastructure attributes incoming funds to campaigns.
            Webhooks plus transaction verification keep our ledger accurate. The
            payout API executes controlled disbursements to verified
            beneficiaries. Every stage is visible on the campaign page.
          </p>
          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Virtual account per campaign",
              "HMAC-verified webhooks",
              "Bank-resolve beneficiaries",
              "Rule-gated Kora payouts",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/15 bg-white/[0.06] px-5 py-4 text-[15px] font-medium shadow-card"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- IMPACT STORIES ---------------------------- */}
      <section id="stories" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
        <p className="eyebrow text-muted">Impact stories</p>
        <h2 className="display-md mt-2 max-w-2xl text-3xl sm:text-4xl">
          Real campaigns, real receipts
        </h2>
        <p className="mt-3 max-w-xl text-[15px] text-body">
          Owners, contributors and coordinators on what changes when every naira
          is tracked and released by rule.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {IMPACT_STORIES.map((story) => (
            <figure
              key={story.name}
              className="flex flex-col rounded-xl border border-hairline bg-white p-7 shadow-card transition-shadow hover:shadow-pop"
            >
              <span className="inline-flex w-fit rounded-full bg-voltage px-3 py-1 text-xs font-bold text-ink">
                {story.stat}
              </span>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-hairline pt-4">
                <p className="text-sm font-extrabold">{story.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{story.detail}</p>
                <p className="mt-1 text-[13px] font-medium text-body">{story.campaign}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------------------------- FAQ ---------------------------------- */}
      <section id="faq" className="scroll-mt-20 border-t border-hairline bg-soft">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <p className="eyebrow text-muted">FAQ</p>
          <h2 className="display-md mt-2 text-3xl sm:text-4xl">Questions, answered</h2>
          <p className="mt-3 text-[15px] text-body">
            How money moves, who gets paid, and what happens when things go wrong.
          </p>
          <Faq items={FAQS} />
        </div>
      </section>

      {/* --------------------------------- CTA ---------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-ink/10 bg-voltage px-6 py-12 text-center text-ink shadow-card sm:px-12">
          <h2 className="display-md mx-auto max-w-xl text-3xl sm:text-4xl">
            Fundraising anyone can audit live.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] font-medium text-ink/70">
            Create a campaign, make a test contribution, approve a milestone,
            execute a payout. The whole loop in minutes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/create">
              <Button variant="dark" size="lg">
                Start a campaign
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="outline" size="lg" className="bg-white">
                See a live campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

