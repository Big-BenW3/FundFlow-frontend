// Type definitions mirroring the FastAPI responses.

export type Visibility = "PUBLIC" | "UNLISTED" | "PRIVATE";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface OwnerRef {
  id: number;
  name: string | null;
}

export interface CollectionAccount {
  provider: string;
  account_number: string;
  account_reference: string;
  bank_name: string;
  bank_code: string | null;
  currency: string;
  status: string;
}

export interface CampaignStats {
  raised: number;
  target: number;
  progress: number;
  contributors: number;
  contributions_count: number;
  disbursed: number;
  available: number;
  pending_payouts: number;
  days_remaining: number | null;
}

export interface Campaign {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  category: string;
  visibility: Visibility;
  currency: string;
  target_amount: number;
  raised_amount: number;
  disbursed_amount: number;
  progress: number;
  deadline: string | null;
  status: CampaignStatus;
  cover_image: string | null;
  is_diaspora: boolean;
  created_at: string;
  updated_at: string;
  owner: OwnerRef;
  description?: string;
  account?: CollectionAccount | null;
  stats?: CampaignStats;
}

export interface ContributionItem {
  id: number;
  campaign_id: number;
  kora_reference: string;
  amount: number;
  currency: string;
  fee: number;
  contributor: { id: number | null; name: string | null };
  anonymous: boolean;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  payment_method: string;
  transaction_date: string | null;
  created_at: string;
  payer_bank_name?: string;
}

export interface BeneficiaryRef {
  id: number;
  name: string;
  bank_name?: string;
  account_number?: string;
  verification_status: string;
}

export interface Beneficiary extends BeneficiaryRef {
  campaign_id: number;
  beneficiary_type: string;
  bank_code: string;
  bank_name: string;
  account_number: string;
  resolved_account_name: string | null;
  currency: string;
  created_at: string;
}

export interface Milestone {
  id: number;
  campaign_id: number;
  order_index: number;
  name: string;
  description: string | null;
  amount: number;
  beneficiary: BeneficiaryRef | null;
  trigger_type: string;
  threshold_amount: number | null;
  threshold_percentage: number | null;
  due_date: string | null;
  requires_approval: boolean;
  status: "PENDING" | "APPROVED" | "PAID";
  state: string;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Payout {
  id: number;
  campaign_id: number;
  kora_reference: string | null;
  amount: number;
  currency: string;
  status: "DRAFT" | "LOCKED" | "READY" | "PROCESSING" | "UNKNOWN" | "SUCCESS" | "FAILED";
  failure_reason: string | null;
  beneficiary: BeneficiaryRef | null;
  milestone_id: number | null;
  milestone_name: string | null;
  rule_id: number | null;
  approved_at: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface PayoutRule {
  id: number;
  campaign_id: number;
  label: string | null;
  amount: number | null;
  percentage: number | null;
  trigger_type: string;
  threshold_amount: number | null;
  threshold_percentage: number | null;
  due_date: string | null;
  requires_approval: boolean;
  status: string;
  milestone_id: number | null;
  beneficiary: BeneficiaryRef | null;
  created_at: string;
}

export interface LedgerEntry {
  id: number;
  type: string;
  amount: number;
  currency: string;
  reference: string | null;
  description: string | null;
  created_at: string;
}

export interface CampaignUpdate {
  id: number;
  campaign_id: number;
  milestone_id: number | null;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
}

export interface Member {
  user_id: number;
  role: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface AuditEntry {
  id: number;
  actor_id: number | null;
  action: string;
  description: string;
  reference: string | null;
  created_at: string;
}

export interface AppNotification {
  id: number;
  campaign_id: number | null;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface Bank {
  name: string;
  code: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  created_at: string;
}
