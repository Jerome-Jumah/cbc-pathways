import "server-only";

import type {
  CombinationProfileData,
  CombinationProfileResponse,
  CombinationsListResponse,
  NewSchoolCombinationsResponse,
  PaginationMeta,
  School,
  SchoolCombinationsData,
  SchoolProfileData,
  SchoolProfileResponse,
  SchoolsListResponse,
  SubjectCombination,
  Track,
  TrackResponse,
  TracksResponse,
} from "@/types/api";

const BASE_URL =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Builds a query string safely from an object, omitting empty/undefined fields.
 */
export function buildQuery(
  params: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined | null
  >,
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

/**
 * Server-only fetch wrapper with caching support.
 */
async function serverFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } },
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(0, "Network error - unable to reach the API server.");
  }

  if (!res.ok) {
    let message = `API request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error?.message) {
        message = body.error.message;
      } else if (body?.message) {
        message = body.message;
      }
    } catch {
      // ignore json parse errors
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ─── Query Endpoints ──────────────────────────────────────────────────────────

/**
 * Get all CBC tracks with their profiles.
 * Cached for 24 hours (86,400s) as track data is static.
 */
export async function getTracks(): Promise<Track[]> {
  try {
    const res = await serverFetch<TracksResponse>("/track-profiles", {
      next: { revalidate: 86400 },
    });
    return res.data ?? [];
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return [];
    throw err;
  }
}

/**
 * Get a single track by its ID.
 * Cached for 24 hours.
 */
export async function getTrackById(trackId: string): Promise<Track | null> {
  try {
    const res = await serverFetch<TrackResponse>(
      `/track-profiles/${encodeURIComponent(trackId)}`,
      { next: { revalidate: 86400 } },
    );
    return res.data ?? null;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

export interface GetCombinationsQuery {
  trackId?: string;
  track?: string;
  subjects?: string | string[];
  limit?: number;
  page?: number;
  search?: string;
}

/**
 * Get paginated list of combinations.
 * Cached for 1 hour.
 */
export async function getCombinations(
  query: GetCombinationsQuery = {},
): Promise<{ data: SubjectCombination[]; meta: PaginationMeta }> {
  try {
    const qs = buildQuery(query as Record<string, string | number | boolean | Array<string | number | boolean> | undefined | null>);
    const res = await serverFetch<CombinationsListResponse>(`/combinations${qs}`, {
      next: { revalidate: 3600 },
    });
    return {
      data: res.data?.data ?? [],
      meta: res.data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    }
    throw err;
  }
}

/**
 * Get full profile for a school.
 * Cached for 1 hour.
 */
export async function getSchoolProfile(schoolId: string): Promise<SchoolProfileData | null> {
  try {
    const res = await serverFetch<SchoolProfileResponse>(
      `/schools/${encodeURIComponent(schoolId)}/profile`,
      { next: { revalidate: 3600 } },
    );
    return res.data ?? null;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

/**
 * Get all combinations offered by a school, grouped by track.
 * Cached for 1 hour.
 */
export async function getSchoolCombinations(
  schoolId: string,
): Promise<SchoolCombinationsData | null> {
  try {
    const res = await serverFetch<NewSchoolCombinationsResponse>(
      `/schools/${encodeURIComponent(schoolId)}/combinations`,
      { next: { revalidate: 3600 } },
    );
    return res.data ?? null;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      return null;
    }
    throw err;
  }
}

/**
 * Get combination profile details.
 * Safe read path: `generate` defaults to false.
 * Cached for 1 hour.
 */
export async function getCombinationProfile(
  combinationId: string,
  generate = false,
): Promise<CombinationProfileData | null> {
  const qs = generate ? "?generate=true" : "";
  try {
    const res = await serverFetch<CombinationProfileResponse>(
      `/combinations/${encodeURIComponent(combinationId)}/profile${qs}`,
      { next: { revalidate: 3600 } },
    );
    return res.data ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      // Differentiate: combination exists without profile vs nonexistent combination
      const isPendingProfile =
        err.message.includes("No profile found") ||
        err.message.includes("?generate=true") ||
        err.message.includes("generate one");

      if (isPendingProfile) {
        return { found: false, combinationExists: true };
      }
      return null;
    }
    throw err;
  }
}

export interface GetSchoolsQuery {
  search?: string;
  track?: string;
  county?: string;
  gender?: string;
  accommodation?: string;
  subjects?: string[];
  category?: string;
  cluster?: string;
  preferredTrack?: string;
  recommendedCombinationIds?: string;
  sort?: string;
  limit?: number;
  page?: number;
}

/**
 * Get paginated list of schools with filter and search support.
 * Cached for 10 minutes.
 */
export async function getSchools(
  query: GetSchoolsQuery = {},
): Promise<{ data: School[]; meta: PaginationMeta }> {
  try {
    const qs = buildQuery(query as Record<string, string | number | boolean | Array<string | number | boolean> | undefined | null>);
    const res = await serverFetch<SchoolsListResponse>(`/schools${qs}`, {
      next: { revalidate: 600 },
    });
    return {
      data: res.data?.data ?? [],
      meta: res.data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 },
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 20, totalPages: 1 },
      };
    }
    throw err;
  }
}
