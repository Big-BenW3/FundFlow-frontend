"use client";

/* Form primitives + empty states. */

import React from "react";
import { cn } from "@/components/ui";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({ label, hint, error, className, id, ...rest }: FieldProps) {
  const inputId = id ?? rest.name;
  return (
    <label className="block" htmlFor={inputId}>
      {label && (
        <span className="block text-[13px] font-semibold text-ink mb-1.5">{label}</span>
      )}
      <input
        id={inputId}
        className={cn(
          "block w-full h-11 rounded-md border bg-white px-3.5 text-sm text-ink",
          "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/60",
          error ? "border-danger" : "border-hairline",
          className
        )}
        {...rest}
      />
      {error ? (
        <span className="block text-[13px] text-danger mt-1.5">{error}</span>
      ) : hint ? (
        <span className="block text-[13px] text-muted mt-1.5">{hint}</span>
      ) : null}
    </label>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className, ...rest }: TextareaProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[13px] font-semibold text-ink mb-1.5">{label}</span>
      )}
      <textarea
        className={cn(
          "block w-full min-h-[120px] rounded-md border bg-white px-3.5 py-3 text-sm text-ink",
          "placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/60",
          error ? "border-danger" : "border-hairline",
          className
        )}
        {...rest}
      />
      {error && <span className="block text-[13px] text-danger mt-1.5">{error}</span>}
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ label, error, className, children, ...rest }: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[13px] font-semibold text-ink mb-1.5">{label}</span>
      )}
      <select
        className={cn(
          "block w-full h-11 rounded-md border border-hairline bg-white px-3 text-sm text-ink",
          "focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/60",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="block text-[13px] text-danger mt-1.5">{error}</span>}
    </label>
  );
}

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
