import Link from "next/link";
import CampaignCard from "@/components/campaign-card";
import { Faq } from "@/components/faq";
import { Button } from "@/components/ui";
import { Skeleton, SkeletonSection, SkeletonCampaignCard } from "@/components/ui";
import type { Campaign } from "@/types";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23F3F4F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='24' fill='%239CA3AF'%3ECampaign image%3C/text%3E%3C/svg%3E";

const HERO_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23F3F4F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='48' fill='%239CA3AF'%3ECommunity fundraising hero%3C/text%3E%3C/svg%3E";

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: "Build A Community Health Center",
    slug: "build-a-community-health-center",
    short_description:
      "A community-driven health centre for Orlu, built stage by stage with funds released only when each milestone is approved.",
    category: "Health",
    visibility: "PUBLIC",
    currency: "NGN",
    target_amount: 20000000,
    raised_amount: 7500000,
    disbursed_amount: 4000000,
    progress: 37.5,
    deadline: "2027-03-15",
    status: "ACTIVE",
    cover_image: PLACEHOLDER_SVG,
    is_diaspora: false,
    created_at: "2026-09-01T00:00:00Z",
    updated_at: "2026-09-01T00:00:00Z",
    owner: { id: 1, name: "Adaeze Okonkwo" },
    account: {
      provider: "Kora",
      account_number: "1234567890",
      account_reference: "KPY-VA-ORLU-001",
      bank_name: "United Bank for Africa",
      bank_code: "033",
      currency: "NGN",
      status: "active",
    },
    stats: {
      raised: 7500000,
      target: 20000000,
      progress: 37.5,
      contributors: 1204,
      contributions_count: 1204,
      disbursed: 4000000,
      available: 3500000,
      pending_payouts: 0,
      days_remaining: 129,
    },
  },
  {
    id: 2,
    title: "Rebuild The Community Water System",
    slug: "rebuild-the-community-water-system",
    short_description:
      "Borehole repair for Eke, releasing funds in stages so the installer gets paid only after commissioning.",
    category: "Community",
    visibility: "PUBLIC",
    currency: "NGN",
    target_amount: 10000000,
    raised_amount: 8200000,
    disbursed_amount: 5000000,
    progress: 82,
    deadline: "2027-01-20",
    status: "ACTIVE",
    cover_image: PLACEHOLDER_SVG,
    is_diaspora: true,
    created_at: "2026-08-10T00:00:00Z",
    updated_at: "2026-08-10T00:00:00Z",
    owner: { id: 2, name: "Fatima Bello" },
    account: {
      provider: "Kora",
      account_number: "0987654321",
      account_reference: "KPY-VA-EKE-002",
      bank_name: "Guaranty Trust Bank",
      bank_code: "058",
      currency: "NGN",
      status: "active",
    },
    stats: {
      raised: 8200000,
      target: 10000000,
      progress: 82,
      contributors: 342,
      contributions_count: 342,
      disbursed: 5000000,
      available: 3200000,
      pending_payouts: 0,
      days_remaining: 75,
    },
  },
  {
    id: 3,
    title: "Family Medical Fund",
    slug: "family-medical-fund",
    short_description:
      "Private fund for Sarah's surgery. Only invited family members can see the payout plan and ledger.",
    category: "Medical",
    visibility: "PRIVATE",
    currency: "NGN",
    target_amount: 8000000,
    raised_amount: 6100000,
    disbursed_amount: 0,
    progress: 76.25,
    deadline: "2026-12-10",
    status: "ACTIVE",
    cover_image: PLACEHOLDER_SVG,
    is_diaspora: false,
    created_at: "2026-07-20T00:00:00Z",
    updated_at: "2026-07-20T00:00:00Z",
    owner: { id: 3, name: "Chidi Eze" },
    account: {
      provider: "Kora",
      account_number: "1122334455",
      account_reference: "KPY-VA-SARAH-003",
      bank_name: "Access Bank",
      bank_code: "044",
      currency: "NGN",
      status: "active",
    },
    stats: {
      raised: 6100000,
      target: 8000000,
      progress: 76.25,
      contributors: 89,
      contributions_count: 89,
      disbursed: 0,
      available: 6100000,
      pending_payouts: 0,
      days_remaining: 34,
    },
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Open a campaign",
    body: "Every campaign gets a dedicated Kora collection account automatically.",
  },
  {
    step: "02",
    title: "Track every naira",
    body: "Contributions land in a public ledger with real time totals.",
  },
  {
    step: "03",
    title: "Set the rules",
    body: "Define milestones, approvals and payout rules before the first contribution arrives.",
  },
  {
    step: "04",
    title: "Release by rule",
    body: "Funds move to verified beneficiaries only when your conditions are met.",
  },
] as const;

const IMPACT_STORIES = [
  {
    stat: "7.5M naira raised",
    quote:
      "The health centre foundation was cast on schedule because the money could only move when the milestone was approved. Donors watched it happen.",
    name: "Adaeze Okonkwo",
    detail: "Campaign owner, Orlu",
    campaign: "Build A Community Health Center",
  },
  {
    stat: "2M naira given",
    quote:
      "I contributed from London and could see my transfer land in the public ledger the same day. That transparency is why I gave twice.",
    name: "Chidi Eze",
    detail: "Diaspora contributor",
    campaign: "Rebuild The Community Water System",
  },
  {
    stat: "3,000 residents served",
    quote:
      "Our borehole repair released funds in stages, so the installer only got paid after commissioning. No stories, just receipts.",
    name: "Fatima Bello",
    detail: "Community coordinator, Eke",
    campaign: "Rebuild The Community Water System",
  },
] as const;

const FLOW_STEPS = [
  {
    label: "Contribute",
    body: "Donor pays into the campaign's dedicated Kora collection account by bank transfer or card.",
  },
  {
    label: "Verify",
    body: "Kora webhook arrives, FundFlow verifies the transaction against Kora records, and the ledger is updated.",
  },
  {
    label: "Hold",
    body: "Funds stay in the campaign's virtual account until a milestone trigger is met.",
  },
  {
    label: "Release",
    body: "Owner approves the milestone, beneficiary is verified, and Kora executes the payout.",
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

export default function HomePage() {
  return (
    <div>
      {/* --------------------------------- HERO --------------------------------- */}
      <section
        id="top"
        className="relative overflow-hidden bg-soft"
        aria-label="Hero"
      >
        <div
          className="absolute inset-0 z-0"
          aria-hidden
        >
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(253,255,77,0.12),transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-24 sm:px-6 sm:pt-32 sm:pb-32 lg:px-8 lg:pt-48 lg:pb-48 xl:pt-60 xl:pb-60 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow text-voltage font-bold tracking-tighter uppercase text-xs">
              Programmable fundraising
            </p>
            <h1 className="display-xl mt-4 max-w-full text-white text-5xl sm:text-6xl lg:text-6xl xl:text-7xl leading-[1.02]">
              Raise money. Show where it goes. Release it by rule.
            </h1>
            <p className="mx-auto mt-6 text-lg text-white/90 leading-relaxed lg:text-xl max-w-2xl">
              Structured fundraising: Kora-powered collection, an immutable
              ledger, and payouts released only when your rules are met.
            </p>
            <div className="mx-auto mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link href="/create">
                <Button size="lg" className="shadow-lg shadow-voltage/30 w-full sm:w-auto">
                  Start a campaign
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/30 w-full sm:w-auto">
                  Explore campaigns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ LIVE CAMPAIGNS --------------------------- */}
      <section id="campaigns" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
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
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_CAMPAIGNS.map((campaign, index) => (
            <div key={campaign.id} className={`rise-in rise-in-${index + 1}`}>
              <CampaignCard campaign={campaign} large />
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------ MONEY LOOP ------------------------------ */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-hairline bg-ink text-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="eyebrow text-voltage font-bold">How it works</p>
          <h2 className="display-md mt-2 max-w-2xl text-3xl sm:text-4xl">
            Kora is not our checkout, it is the financial lifecycle.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Collection infrastructure attributes incoming funds to campaigns. Webhooks
            plus transaction verification keep our ledger accurate. The payout API
            executes controlled disbursements to verified beneficiaries. Every stage
            is visible on the campaign page.
          </p>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative flex flex-col items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-voltage font-extrabold text-sm">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-[14px] text-white/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- IMPACT STORIES ---------------------------- */}
      <section id="stories" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted">Impact stories</p>
            <h2 className="display-md mt-2 text-3xl sm:text-4xl">Real campaigns, real receipts</h2>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-[15px] text-body">
          Owners, contributors and coordinators on what changes when every naira is
          tracked and released by rule.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {IMPACT_STORIES.map((story) => (
            <figure
              key={story.name}
              className="flex flex-col rounded-xl border border-hairline bg-card p-7 hover-lift"
            >
              <span className="inline-flex w-fit rounded-full bg-voltage px-3 py-1 text-xs font-bold text-ink">
                {story.stat}
              </span>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-hairline pt-4">
                <p className="text-sm font-extrabold text-ink">{story.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{story.detail}</p>
                <p className="mt-1 text-[13px] font-medium text-body">{story.campaign}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ------------------------------ MONEY FLOW ------------------------------ */}
      <section id="flow" className="scroll-mt-20 border-t border-hairline bg-card py-20 sm:px-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">How your money moves</p>
              <h2 className="display-md mt-2 text-3xl sm:text-4xl">Built for transparency, not trust</h2>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-[15px] text-body">
            Every contribution follows a defined path: collected through Kora,
            recorded in the campaign ledger, released only when milestones are
            approved, and paid to verified beneficiaries.
          </p>

          {/* Flow diagram */}
          <div className="mt-14 relative overflow-hidden">
            <div className="absolute left-3 top-4 w-px h-full bg-hairline lg:left-1/2 lg:-translate-x-1/2" />
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-between">
              {FLOW_STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-3 w-full lg:w-[140px] relative z-10 hover-lift cursor-default"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-voltage text-ink font-extrabold text-sm shadow-lg shadow-voltage/30">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-extrabold tracking-tight text-ink">
                    {step.label}
                  </h3>
                  <p className="text-[13px] text-muted text-center leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Connecting arrows between steps on desktop */}
            <div className="lg:hidden mt-6 flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="text-voltage font-bold text-lg">›</span>
              ))}
            </div>
          </div>

          <p className="mt-10 max-w-2xl text-[14px] text-muted leading-relaxed">
            No lump sums. No blind trust. Funds move only when the rules you set
            are met — and every move is recorded in the public ledger.
          </p>
        </div>
      </section>

      {/* ---------------------------------- FAQ ---------------------------------- */}
      <section id="faq" className="scroll-mt-20 border-t border-hairline bg-card py-20 sm:px-6">
        <div className="mx-auto max-w-3xl px-4">
          <p className="eyebrow text-muted">FAQ</p>
          <h2 className="display-md mt-2 text-3xl sm:text-4xl">Questions, answered</h2>
          <p className="mt-3 text-[15px] text-body">
            How money moves, who gets paid, and what happens when things go wrong.
          </p>
          <Faq items={FAQS} />
        </div>
      </section>

      {/* --------------------------------- CTA ---------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-xl border border-voltage/20 bg-voltage px-8 py-16 text-center text-ink shadow-card sm:px-16 lg:py-24">
          <h2 className="display-md mx-auto max-w-xl text-3xl sm:text-4xl font-extrabold tracking-tight">
            Fundraising anyone can audit live.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg font-medium text-ink/80 leading-relaxed sm:text-xl">
            Create a campaign, make a test contribution, approve a milestone,
            execute a payout. The whole loop in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/create">
              <Button variant="dark" size="lg">
                Start a campaign
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="lg" className="bg-white border-white/30 hover:bg-white">
                See a live campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}