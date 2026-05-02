/**
 * Analytics Event Tracking Helper
 *
 * Wraps Vercel Analytics `track()` with typed events.
 * All payloads are anonymous — no personal student data is ever sent.
 */

import { track } from "@vercel/analytics";

type TrackEventName =
  | "subject_search_submitted"
  | "school_selected"
  | "combination_selected"
  | "recommendation_flow_started"
  | "recommendation_flow_completed"
  | "filters_applied"
  | "track_explored"
  | "school_page_viewed"
  | "combination_page_viewed";

type TrackEventPayload = Record<string, string | number | boolean>;

/**
 * Track an anonymous product event.
 *
 * @example
 * trackEvent("subject_search_submitted", { subjectCount: 3, county: "Nairobi" });
 * trackEvent("school_selected", { schoolId: "alliance-high", cluster: "C1" });
 * trackEvent("filters_applied", { filterType: "county", county: "Kiambu" });
 */
export function trackEvent(
  name: TrackEventName,
  payload?: TrackEventPayload
): void {
  try {
    track(name, payload);
  } catch {
    // Silently fail — analytics should never break the app
  }
}
