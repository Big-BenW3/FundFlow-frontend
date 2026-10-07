// API client + shared helpers.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "fundflow_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await response.text();
  const body = text ? (JSON.parse(text) as T & { detail?: string }) : ({} as T);
  if (!response.ok) {
    throw new ApiError(
      response.status,
      typeof body === "object" && body && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : `Request failed (${response.status})`
    );
  }
  return body as T;
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  del: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
};

/* ------------------------------ formatting ------------------------------ */

export function naira(amount: number | null | undefined, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? (Number.isInteger(amount ?? 0) ? 0 : 2);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "TBD";
  const date = new Date(value);
  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "TBD";
  const date = new Date(value);
  return date.toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeLeft(deadline: string | null | undefined): string {
  if (!deadline) return "No deadline";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86_400_000);
  if (days > 1) return `${days} days left`;
  if (days === 1) return "1 day left";
  const hours = Math.floor(diff / 3_600_000);
  return hours > 1 ? `${hours} hours left` : "Ending soon";
}

export const CATEGORIES = [
  "Medical",
  "Education",
  "Community",
  "NGO",
  "Charity",
  "Emergency",
  "Family",
  "Business",
  "Religious",
  "Event",
  "Other",
];

export const AMOUNT_PRESETS = [5_000, 10_000, 25_000, 50_000];
