/**
 * API Client
 * Centralised fetch utilities for the CBC Pathways frontend.
 * Reads NEXT_PUBLIC_API_BASE_URL from the environment.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

// ─── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch (networkErr) {
    throw new ApiError(0, "Network error – unable to reach the server.");
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      // ignore JSON parse errors on error bodies
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ─── Public helpers ────────────────────────────────────────────────────────────

export async function apiGet<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  return request<T>(path, { method: "GET", ...options });
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  options?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export async function apiPut<T>(
  path: string,
  body: unknown,
  options?: RequestInit,
): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  });
}

// ─── URL builder helper ────────────────────────────────────────────────────────

/**
 * Builds a query string from an object, omitting undefined/null/empty values.
 */
export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
