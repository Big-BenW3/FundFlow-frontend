"use client";

/* Sign in. */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/components/auth-provider";
import { Input } from "@/components/forms";
import { Button } from "@/components/ui";
import { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Every naira you raised is still working, right on schedule."
      body="Sign in to track contributions, approve milestones and release payouts to verified beneficiaries."
    >
      <div className="rise-in">
        <h1 className="display-md text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-body">Sign in to manage your campaigns.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <p className="rounded-md border border-danger/20 bg-[#FDECEC] px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-body">
            New here?{" "}
            <Link href="/auth/register" className="font-semibold text-ink underline">
              Create an account
            </Link>
          </p>
          <p className="rounded-md bg-soft px-3.5 py-2.5 text-center text-[13px] text-body">
            Demo login: <span className="font-semibold text-ink">demo@fundflow.app</span> /{" "}
            <span className="font-semibold text-ink">password12345</span>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
