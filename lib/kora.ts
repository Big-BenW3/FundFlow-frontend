// Kora Checkout Standard (Inline) loader + launcher.
// Docs: https://developers.korapay.com/docs/checkout-standard
// Script: https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js
// Exposes window.Korapay.initialize({ key, reference, amount, currency, customer, ... })

export const KORA_SCRIPT_SRC =
  "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js";

export interface KoraCustomer {
  name: string;
  email: string;
}

export interface KoraInitOpts {
  key: string;
  reference: string;
  amount: number;
  currency: string;
  customer: KoraCustomer;
  narration?: string;
  channels?: string[];
  default_channel?: string;
  onSuccess?: (data: { reference: string; amount: string; status: string }) => void;
  onFailed?: (data: { reference: string; amount: string; status: string }) => void;
  onClose?: () => void;
  onPending?: () => void;
}

declare global {
  interface Window {
    Korapay?: {
      initialize: (opts: KoraInitOpts) => void;
      close?: () => void;
    };
  }
}

let scriptPromise: Promise<boolean> | null = null;

export function loadKoraScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Korapay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${KORA_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(!!window.Korapay));
      existing.addEventListener("error", () => resolve(false));
      // Already in DOM but unknown state — poll briefly.
      setTimeout(() => resolve(!!window.Korapay), 3000);
      return;
    }
    const script = document.createElement("script");
    script.src = KORA_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(!!window.Korapay);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
    // Safety timeout so UI never hangs on script load.
    setTimeout(() => resolve(!!window.Korapay), 8000);
  });
  return scriptPromise;
}

export function launchKoraCheckout(opts: KoraInitOpts): boolean {
  if (typeof window === "undefined" || !window.Korapay) return false;
  window.Korapay.initialize(opts);
  return true;
}
