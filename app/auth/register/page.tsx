"use client";

/* Register. */

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
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password needs at least 8 characters"),
});

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ name, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Join FundFlow"
      title="Raise with rules. Show every naira. Pay only on proof."
      body="Create your campaign in minutes, get a dedicated Kora collection account, and let donors watch each milestone unlock."
    >
      <div className="rise-in">
        <h1 className="display-md text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-body">Start raising with transparent rules in minutes.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Adaeze Okonkwo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error && (
            <p className="rounded-md border border-danger/20 bg-[#FDECEC] px-3.5 py-2.5 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-body">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-ink underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
