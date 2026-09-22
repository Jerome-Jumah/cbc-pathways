import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as vercelAnalytics from "@vercel/analytics";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

async function loadUmamiAnalytics() {
  vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "123e4567-e89b-12d3-a456-426614174000");
  vi.stubEnv("NEXT_PUBLIC_UMAMI_SCRIPT_URL", "https://stats.example.test/script.js");
  vi.resetModules();
  return import("@/lib/analytics");
}

describe("analytics events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "");
    vi.stubEnv("NEXT_PUBLIC_UMAMI_SCRIPT_URL", "");
    window.umami = undefined;
  });

  afterEach(() => {
    delete (window as { umami?: unknown }).umami;
    vi.unstubAllEnvs();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("dispatches to Vercel when Umami is explicitly disabled", async () => {
    vi.resetModules();
    const { trackEvent } = await import("@/lib/analytics");

    trackEvent("school_search_started", { subjectCount: 2, page: 1 });

    expect(vercelAnalytics.track).toHaveBeenCalledWith("school_search_started", { subjectCount: 2, page: 1 });
  });

  it("queues the first interaction and sends it when the delayed tracker is ready", async () => {
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn();

    trackEvent("school_search_started", { subjectCount: 2, page: 1, county: "Nairobi" });
    expect(umamiTrack).not.toHaveBeenCalled();

    window.umami = { track: umamiTrack };
    markUmamiReady();

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith("school_search_started", { subjectCount: 2, page: 1, county: "Nairobi" });
    expect(vercelAnalytics.track).toHaveBeenCalledTimes(1);
  });

  it("removes empty optional properties before dispatch", async () => {
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    markUmamiReady();

    trackEvent("school_search_started", { subjectCount: 0, page: 1, county: "", cluster: undefined });

    expect(umamiTrack).toHaveBeenCalledWith("school_search_started", { subjectCount: 0, page: 1 });
  });

  it("keeps Vercel tracking independent when Umami throws", async () => {
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn(() => { throw new Error("blocked"); });
    window.umami = { track: umamiTrack };
    markUmamiReady();
    vi.spyOn(console, "error").mockImplementation(() => {});

    trackEvent("recommendation_completed", { pathwayCount: 3, schoolCount: 5 });

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(vercelAnalytics.track).toHaveBeenCalledTimes(1);
  });

  it("keeps Umami tracking independent when Vercel throws", async () => {
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    markUmamiReady();
    vi.mocked(vercelAnalytics.track).mockImplementationOnce(() => { throw new Error("blocked"); });
    vi.spyOn(console, "error").mockImplementation(() => {});

    trackEvent("school_saved", { schoolSlug: "alliance-high-school", saved: true });

    expect(umamiTrack).toHaveBeenCalledTimes(1);
  });

  it("drops queued events after a bounded readiness timeout", async () => {
    vi.useFakeTimers();
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    vi.spyOn(console, "warn").mockImplementation(() => {});

    trackEvent("school_search_completed", { resultCount: 8, page: 1 });
    await vi.advanceTimersByTimeAsync(10_000);
    markUmamiReady();

    expect(umamiTrack).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("dropped 1 queued event"));
  });

  it("recovers after queue expiration and delivers later events once", async () => {
    vi.useFakeTimers();
    const { trackEvent, markUmamiReady } = await loadUmamiAnalytics();
    const umamiTrack = vi.fn();
    window.umami = { track: umamiTrack };
    vi.spyOn(console, "warn").mockImplementation(() => {});

    trackEvent("school_search_completed", { resultCount: 8, page: 1 });
    await vi.advanceTimersByTimeAsync(10_000);

    markUmamiReady();
    trackEvent("school_search_completed", { resultCount: 9, page: 1 });

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith("school_search_completed", { resultCount: 9, page: 1 });
    expect(umamiTrack).not.toHaveBeenCalledWith("school_search_completed", { resultCount: 8, page: 1 });
  });

  it("does not send events during server rendering", async () => {
    vi.resetModules();
    const { trackEvent } = await import("@/lib/analytics");
    const originalWindow = global.window;
    try {
      // @ts-expect-error simulate a server module call
      delete global.window;
      expect(() => trackEvent("school_saved", { schoolSlug: "alliance-high-school", saved: true })).not.toThrow();
    } finally {
      global.window = originalWindow;
    }
  });
});
