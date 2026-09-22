import { afterEach, describe, expect, it, vi } from "vitest";
import { getSchoolProfileById, getSchoolProfileBySlug, getSchoolCombinationsBySlug } from "@/lib/api/server";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("explicit school API lookup paths", () => {
  it("always uses the slug endpoint for the slug lookup, even when the slug looks like an ID", async () => {
    const requestedUrls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      requestedUrls.push(String(input));
      return Response.json({ success: true, data: { school: { slug: "a".repeat(64) } } });
    }));

    await getSchoolProfileBySlug("a".repeat(64));

    expect(requestedUrls[0]).toBe(`https://api.example.test/api/schools/by-slug/${"a".repeat(64)}/profile`);
  });

  it("uses the ID route only when the caller explicitly selects an ID lookup", async () => {
    const requestedUrls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      requestedUrls.push(String(input));
      return Response.json({ success: true, data: { school: { slug: "alliance-high-school" } } });
    }));

    await getSchoolProfileById("a".repeat(64));

    expect(requestedUrls[0]).toBe(`https://api.example.test/api/schools/${"a".repeat(64)}/profile`);
  });

  it("uses the slug-only combinations endpoint", async () => {
    const requestedUrls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      requestedUrls.push(String(input));
      return Response.json({ success: true, data: { schoolId: "id", schoolSlug: "alliance-high-school" } });
    }));

    await getSchoolCombinationsBySlug("alliance-high-school");

    expect(requestedUrls[0]).toBe("https://api.example.test/api/schools/by-slug/alliance-high-school/combinations");
  });
});
