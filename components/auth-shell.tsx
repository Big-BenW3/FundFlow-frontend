"use client";

/* Shared two-column auth shell: image panel + form panel. */

import { Logo } from "@/components/logo";

const PANEL_IMAGE =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80";

export function AuthShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid overflow-hidden rounded-xl border border-hairline bg-white shadow-card md:grid-cols-2">
        {/* Left: image panel */}
        <div className="relative hidden min-h-[520px] md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PANEL_IMAGE}
            alt="Volunteers handing food donations to a community"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />
          <div className="absolute inset-x-0 top-0 p-7">
            <Logo size={32} />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
            <p className="eyebrow text-voltage">{eyebrow}</p>
            <p className="display-md mt-2 max-w-sm text-2xl text-white sm:text-3xl">{title}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">{body}</p>
          </div>
        </div>
        {/* Right: form panel */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 sm:py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
