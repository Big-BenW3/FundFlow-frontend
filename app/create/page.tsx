"use client";

/* Campaign creation form — POST /campaigns, backend auto-provisions Kora VBA. */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Input, Select, Textarea } from "@/components/forms";
import { Button, Card, CardContent } from "@/components/ui";
import { ApiError, CATEGORIES, api } from "@/lib/api";
import type { Campaign } from "@/types";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [diaspora, setDiaspora] = useState(false);
  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && !user) {
    router.push("/auth/login?next=/create");
    return null;
  }

  async function submit() {
    setError("");
    setAccountError("");
    const targetAmount = Number(String(target).replace(/[^0-9.]/g, ""));
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!targetAmount || targetAmount <= 0) {
      setError("Enter a valid target amount.");
      return;
    }
    setBusy(true);
    try {
      const body = await api.post<{ campaign: Campaign; account_error: string | null }>(
        "/campaigns",
        {
          title: title.trim(),
          short_description: shortDescription.trim() || null,
          description: description.trim(),
          category,
          visibility,
          currency: "NGN",
          target_amount: targetAmount,
          deadline: deadline ? new Date(deadline).toISOString() : null,
          cover_image: coverImage.trim() || null,
          is_diaspora: diaspora,
        }
      );
      if (body.account_error) setAccountError(body.account_error);
      router.push(`/campaigns/${body.campaign.slug}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not create campaign.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="eyebrow text-muted">New campaign</p>
      <h1 className="display-md mt-2 text-3xl sm:text-4xl">Start a campaign</h1>
      <p className="mt-2 text-sm text-body">
        Creates the campaign and provisions its dedicated Kora collection account automatically.
      </p>

      <Card className="mt-8">
        <CardContent className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Help fund…" />
          <Input
            label="Short description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One line shown on cards (max 500 chars)"
          />
          <Textarea label="Full story" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why this matters, how funds will be used…" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select label="Visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted (link only)</option>
              <option value="PRIVATE">Private</option>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Target (NGN)" value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal" placeholder="500000" />
            <Input label="Deadline (optional)" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <Input label="Cover image URL (optional)" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://…" />
          <button
            onClick={() => setDiaspora((v) => !v)}
            className="flex w-full items-center justify-between rounded-md border border-hairline bg-soft px-4 py-3 text-left"
          >
            <span>
              <span className="block text-sm font-bold">Diaspora campaign</span>
              <span className="block text-[13px] text-body">Accept contributions from abroad</span>
            </span>
            <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${diaspora ? "bg-ink" : "bg-ink/20"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${diaspora ? "left-[22px]" : "left-0.5"}`} />
            </span>
          </button>

          {error && (
            <p className="rounded-md border border-danger/20 bg-[#FDECEC] px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          {accountError && (
            <p className="rounded-md border border-warning/30 bg-[#FFF6E5] px-3.5 py-2.5 text-sm font-medium text-warning">
              Campaign created but collection account failed: {accountError}
            </p>
          )}

          <Button size="lg" disabled={busy} onClick={submit}>
            {busy ? "Creating…" : "Create campaign"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
