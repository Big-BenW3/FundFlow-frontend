"use client";

/* shadcn-style primitive components — light premium theme. */

import React from "react";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---------------------------------- Button ---------------------------------- */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-voltage text-ink hover:bg-voltage-deep border border-ink/10",
  dark: "bg-ink text-white hover:bg-black border border-ink",
  outline: "bg-white text-ink border border-hairline hover:border-ink/40",
  ghost: "bg-transparent text-body hover:text-ink hover:bg-soft",
  danger: "bg-danger text-white hover:brightness-95",
};

const BUTTON_SIZES: Record<string, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
        "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...rest}
    />
  );
}

/* ----------------------------------- Card ----------------------------------- */

export function Card({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-card border border-hairline rounded-lg shadow-card", className)}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-5 pb-1", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold tracking-tight text-ink", className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-body mt-1", className)} {...rest} />;
}

export function CardContent({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5", className)} {...rest} />;
}

/* ---------------------------------- Badge ----------------------------------- */

const BADGE_STYLES: Record<string, string> = {
  default: "bg-soft text-ink border-hairline",
  voltage: "bg-voltage text-ink border-ink/10",
  success: "bg-[#E9F9EF] text-success border-success/20",
  danger: "bg-[#FDECEC] text-danger border-danger/20",
  warning: "bg-[#FFF6E5] text-warning border-warning/30",
  info: "bg-[#EAF1FE] text-info border-info/20",
  dark: "bg-ink text-white border-ink",
};

export function Badge({
  tone = "default",
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof BADGE_STYLES }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_STYLES[tone],
        className
      )}
      {...rest}
    />
  );
}

/* -------------------------------- Progress ---------------------------------- */

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-ink/[0.08]", className)}>
      <div
        className={cn(
          "h-full rounded-full bg-ink transition-[width] duration-700 ease-out",
          barClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* --------------------------------- Skeleton --------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-ink/[0.06]", className)} aria-hidden />;
}

/* --------------------------------- Spinner ---------------------------------- */

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-hidden
    />
  );
}

/* ------------------------------- Empty state -------------------------------- */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-soft/60 px-6 py-12 text-center">
      <p className="text-base font-bold text-ink">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm text-body">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
