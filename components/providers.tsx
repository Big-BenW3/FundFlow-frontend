"use client";

/* Site shell: top nav, footer, providers. */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Badge, Button, cn } from "@/components/ui";
import { Logo } from "@/components/logo";
import { useNotifications } from "@/lib/queries";

function NavInner({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const unread = (notifications ?? []).filter((n) => !n.read).length;

  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "text-sm font-medium transition-colors",
        pathname === href ? "text-ink" : "text-body hover:text-ink"
      )}
    >
      {label}
    </Link>
  );

  const isHome = pathname === "/";
  const sectionLink = (hash: string, label: string) =>
    isHome ? (
      <a
        key={hash}
        href={hash}
        onClick={() => setMobileOpen(false)}
        className="text-sm font-medium text-body transition-colors hover:text-ink"
      >
        {label}
      </a>
    ) : (
      <Link
        key={hash}
        href={`/${hash}`}
        onClick={() => setMobileOpen(false)}
        className="text-sm font-medium text-body transition-colors hover:text-ink"
      >
        {label}
      </Link>
    );

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      <header className="sticky top-0 z-40 border-b border-hairline bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center" aria-label="FundFlow home">
              <Logo size={32} />
            </Link>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
              {sectionLink("#campaigns", "Campaigns")}
              {sectionLink("#how-it-works", "How it works")}
              {sectionLink("#stories", "Stories")}
              {sectionLink("#faq", "FAQ")}
              {user && link("/dashboard", "Dashboard")}
              {link("/create", "Start a campaign")}
            </nav>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <UserMenu
                name={user.name}
                unread={unread}
                onSignOut={() => {
                  logout();
                  router.push("/");
                }}
              />
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/create">
                  <Button size="sm">Start a campaign</Button>
                </Link>
              </>
            )}
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-hairline md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="border-t border-hairline bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {sectionLink("#campaigns", "Campaigns")}
              {sectionLink("#how-it-works", "How it works")}
              {sectionLink("#stories", "Stories")}
              {sectionLink("#faq", "FAQ")}
              {user && link("/dashboard", "Dashboard")}
              {link("/create", "Start a campaign")}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

function UserMenu({
  name,
  unread,
  onSignOut,
}: {
  name: string;
  unread: number;
  onSignOut: () => void;
}) {
  return (
    <>
      <Link
        href="/dashboard?tab=notifications"
        className="relative grid h-10 w-10 place-items-center rounded-md border border-hairline text-body hover:text-ink"
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
            {unread}
          </span>
        )}
      </Link>
      <span className="max-w-[140px] truncate text-sm font-semibold">{name}</span>
      <Button variant="outline" size="sm" onClick={onSignOut}>
        Sign out
      </Button>
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline bg-soft">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Logo size={26} />
          <p className="max-w-md text-[13px] leading-relaxed text-body">
            Programmable fundraising infrastructure. Raise, track and release funds by rule, powered by Kora.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
          <Link href="/campaigns" className="font-medium text-body hover:text-ink">
            All campaigns
          </Link>
          <Link href="/create" className="font-medium text-body hover:text-ink">
            Start a campaign
          </Link>
          <Link href="/dashboard" className="font-medium text-body hover:text-ink">
            Owner dashboard
          </Link>
          <Badge tone="voltage">Demo build, mock Kora mode</Badge>
        </div>
      </div>
    </footer>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 10_000, refetchOnWindowFocus: false },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavInner>{children}</NavInner>
      </AuthProvider>
    </QueryClientProvider>
  );
}

