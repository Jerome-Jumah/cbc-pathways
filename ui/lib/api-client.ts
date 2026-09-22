import { requireApiBaseUrl } from "@/lib/config";

/**
 * API Client
 * Centralised fetch utilities for the CBC Pathways frontend.
 * Reads NEXT_PUBLIC_API_BASE_URL from the environment.
 */

const BASE_URL = requireApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL");

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
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(0, "Network error - unable to reach the server.");
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error?.message) {
        message = body.error.message;
      } else if (body?.message) {
        message = body.message;
      }
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
  params: Record<string, string | number | boolean | Array<string | number | boolean> | undefined | null>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) searchParams.set(key, value.map(String).join(","));
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
