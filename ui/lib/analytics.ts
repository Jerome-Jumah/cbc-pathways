import { track as vercelTrack } from "@vercel/analytics";
import { getUmamiConfig } from "@/lib/config";

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}

export type AnalyticsEventPayloads = {
  school_search_started: {
    county?: string;
    cluster?: string;
    gender?: string;
    accommodation?: string;
    subjectCount: number;
    page: number;
  };
  school_search_completed: { resultCount: number; page: number };
  school_result_opened: {
    schoolSlug: string;
    county: string;
    cluster?: string;
    gender?: string;
    accommodation?: string;
  };
  school_saved: { schoolSlug: string; saved: boolean };
  combination_saved: { combinationId: string; saved: boolean };
  recommendation_started: Record<string, never>;
  recommendation_step_completed: { step: number };
  recommendation_completed: { pathwayCount: number; schoolCount: number };
};

export type AnalyticsEventName = keyof AnalyticsEventPayloads;

const umamiConfig = getUmamiConfig(
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
);
const MAX_PENDING_EVENTS = 25;
const MAX_PENDING_AGE_MS = 10_000;

type PendingEvent = { name: AnalyticsEventName; properties: Record<string, string | number | boolean> };
const pendingEvents: PendingEvent[] = [];
let umamiState: "loading" | "ready" | "disabled" | "failed" = umamiConfig.enabled ? "loading" : "disabled";
let pendingExpiry: ReturnType<typeof setTimeout> | undefined;

function cleanProperties(properties: object): Record<string, string | number | boolean> {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value !== undefined && value !== null && value !== "") clean[key] = value;
  }
  return clean;
}

function clearPendingEvents(): void {
  pendingEvents.length = 0;
  if (pendingExpiry !== undefined) clearTimeout(pendingExpiry);
  pendingExpiry = undefined;
}

function reportUmamiFailure(reason: string): void {
  umamiState = "failed";
  const dropped = pendingEvents.length;
  clearPendingEvents();
  console.error(`[analytics] Umami tracker failed: ${reason}${dropped ? `; dropped ${dropped} queued event(s)` : ""}.`);
}

function sendToUmami(event: PendingEvent): void {
  try {
    window.umami?.track(event.name, event.properties);
  } catch {
    console.error(`[analytics] Umami could not record ${event.name}.`);
  }
}

export function markUmamiReady(): void {
  if (umamiState !== "loading") return;
  if (typeof window.umami?.track !== "function") {
    reportUmamiFailure("script loaded without exposing window.umami.track");
    return;
  }

  umamiState = "ready";
  const queued = pendingEvents.splice(0);
  if (pendingExpiry !== undefined) clearTimeout(pendingExpiry);
  pendingExpiry = undefined;
  queued.forEach(sendToUmami);
}

export function markUmamiFailed(): void {
  if (umamiState === "loading") reportUmamiFailure("script request failed");
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  ...args: AnalyticsEventPayloads[Name] extends Record<string, never>
    ? [properties?: AnalyticsEventPayloads[Name]]
    : [properties: AnalyticsEventPayloads[Name]]
): void {
  if (typeof window === "undefined") return;

  const properties = cleanProperties(args[0] ?? {});
  const event = { name, properties };

  if (umamiState === "ready") {
    sendToUmami(event);
  } else if (umamiState === "loading") {
    if (pendingEvents.length === MAX_PENDING_EVENTS) {
      pendingEvents.shift();
      console.warn("[analytics] Umami event queue is full; the oldest event was dropped.");
    }
    pendingEvents.push(event);
    if (pendingExpiry === undefined) {
      pendingExpiry = setTimeout(() => {
        const dropped = pendingEvents.length;
        pendingEvents.length = 0;
        pendingExpiry = undefined;
        if (dropped) console.warn(`[analytics] Umami tracker was not ready after ${MAX_PENDING_AGE_MS}ms; dropped ${dropped} queued event(s).`);
      }, MAX_PENDING_AGE_MS);
    }
  }

  try {
    vercelTrack(name, properties);
  } catch {
    console.error(`[analytics] Vercel Analytics could not record ${name}.`);
  }
}
