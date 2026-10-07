"use client";

/* FAQ accordion for the landing page. */

import { useState } from "react";
import { cn } from "@/components/ui";

export function Faq({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-8 flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={cn(
              "overflow-hidden rounded-xl border bg-white shadow-card transition-shadow",
              isOpen ? "border-ink/20 shadow-pop" : "border-hairline hover:shadow-pop"
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-[15px] font-extrabold tracking-tight">{item.q}</span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-lg font-bold transition-transform",
                  isOpen ? "rotate-45 border-ink bg-ink text-white" : "border-hairline text-ink"
                )}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-body sm:px-6">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
