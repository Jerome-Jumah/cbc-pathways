import { describe, expect, it } from "vitest";
import { getUmamiConfig, requireApiBaseUrl, requireSiteOrigin } from "@/lib/config";

describe("UI deployment configuration", () => {
  it("normalizes the canonical origin and API base URL", () => {
    expect(requireSiteOrigin("https://schools.example.test///")).toBe("https://schools.example.test");
    expect(requireApiBaseUrl("https://api.example.test/api///", "API_BASE_URL")).toBe("https://api.example.test/api");
  });

  it.each([
    undefined,
    "",
    "api.example.test",
    "ftp://schools.example.test",
    "https://schools.example.test/path",
    "https://user:password@schools.example.test",
  ])("rejects an invalid canonical origin: %s", value => {
    expect(() => requireSiteOrigin(value)).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("rejects invalid API URL fields", () => {
    expect(() => requireApiBaseUrl(undefined, "API_BASE_URL")).toThrow(/API_BASE_URL/);
    expect(() => requireApiBaseUrl("https://api.example.test/api?debug=true", "API_BASE_URL")).toThrow(/query string/);
  });

  it("allows Umami to be explicitly disabled only when both fields are empty", () => {
    expect(getUmamiConfig("", "")).toEqual({ enabled: false });
    expect(() => getUmamiConfig("123e4567-e89b-12d3-a456-426614174000", "")).toThrow(/requires both/);
    expect(() => getUmamiConfig("not-a-uuid", "https://stats.example.test/script.js")).toThrow(/must be a UUID/);
    expect(() => getUmamiConfig("123e4567-e89b-12d3-a456-426614174000", "script.js")).toThrow(/absolute HTTP or HTTPS URL/);
  });

  it("accepts a complete Umami script URL and website ID", () => {
    expect(getUmamiConfig("123e4567-e89b-12d3-a456-426614174000", "https://stats.example.test/script.js")).toEqual({
      enabled: true,
      websiteId: "123e4567-e89b-12d3-a456-426614174000",
      scriptUrl: "https://stats.example.test/script.js",
    });
  });
});
