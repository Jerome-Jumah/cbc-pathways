import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("sitemap pagination and resilience", () => {
  it("includes schools beyond record 10,000 when API pagination indicates more records", async () => {
    // Simulate 11 pages of 1,000 schools each (total 11,000 schools)
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL | Request) => {
        const urlStr = typeof url === "string" ? url : url.toString();

        if (urlStr.includes("/track-profiles")) {
          return Response.json({ success: true, data: [{ id: "track-1" }] });
        }

        if (urlStr.includes("/combinations")) {
          return Response.json({
            success: true,
            data: {
              data: [{ id: "combo-1" }],
              meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
            },
          });
        }

        if (urlStr.includes("/schools")) {
          const match = urlStr.match(/page=(\d+)/);
          const page = match ? parseInt(match[1], 10) : 1;
          const totalPages = 11; // 11,000 schools

          if (page <= totalPages) {
            // Generate 1,000 school ids for this page
            const schools = Array.from({ length: 1000 }, (_, i) => ({
              id: `school-${(page - 1) * 1000 + i + 1}`,
            }));
            return Response.json({
              success: true,
              data: {
                data: schools,
                meta: { total: 11000, page, limit: 1000, totalPages },
              },
            });
          }

          return Response.json({
            success: true,
            data: {
              data: [],
              meta: { total: 11000, page, limit: 1000, totalPages },
            },
          });
        }

        return Response.json({ success: false }, { status: 404 });
      }),
    );

    const entries = await sitemap();
    const schoolUrls = entries.filter((e) => e.url.includes("/school/"));

    // Confirms pagination did NOT truncate at 10,000 and reached 11,000
    expect(schoolUrls.length).toBe(11000);
    expect(schoolUrls[10500].url).toBe("https://cbc-pathways.code4flare.com/school/school-10501");
  });

  it("includes combination records beyond the first page when pagination indicates more records", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL | Request) => {
        const urlStr = typeof url === "string" ? url : url.toString();

        if (urlStr.includes("/track-profiles")) {
          return Response.json({ success: true, data: [] });
        }

        if (urlStr.includes("/combinations")) {
          const match = urlStr.match(/page=(\d+)/);
          const page = match ? parseInt(match[1], 10) : 1;
          const totalPages = 3;

          if (page <= totalPages) {
            const combos = Array.from({ length: 100 }, (_, i) => ({
              id: `combo-p${page}-${i + 1}`,
            }));
            return Response.json({
              success: true,
              data: {
                data: combos,
                meta: { total: 250, page, limit: 100, totalPages },
              },
            });
          }
          return Response.json({
            success: true,
            data: { data: [], meta: { total: 250, page, limit: 100, totalPages } },
          });
        }

        if (urlStr.includes("/schools")) {
          return Response.json({
            success: true,
            data: { data: [], meta: { total: 0, page: 1, limit: 1000, totalPages: 0 } },
          });
        }

        return Response.json({ success: false }, { status: 404 });
      }),
    );

    const entries = await sitemap();
    const comboUrls = entries.filter((e) => e.url.includes("/combination/"));

    expect(comboUrls.length).toBe(300);
    expect(comboUrls.some((e) => e.url.includes("combo-p2-"))).toBe(true);
    expect(comboUrls.some((e) => e.url.includes("combo-p3-"))).toBe(true);
  });

  it("emits static entries without crashing if the API is offline", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("ECONNREFUSED localhost:8080");
      }),
    );

    const entries = await sitemap();
    expect(entries.length).toBe(6);
    expect(entries.map((e) => e.url)).toEqual([
      "https://cbc-pathways.code4flare.com",
      "https://cbc-pathways.code4flare.com/grade-10-subject-combinations",
      "https://cbc-pathways.code4flare.com/explore-tracks",
      "https://cbc-pathways.code4flare.com/find-schools",
      "https://cbc-pathways.code4flare.com/recommendations",
      "https://cbc-pathways.code4flare.com/about",
    ]);
  });
});
