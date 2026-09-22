import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/seo";

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
            // Generate 1,000 schools with canonical slugs for this page
            const schools = Array.from({ length: 1000 }, (_, i) => ({
              id: `school-${(page - 1) * 1000 + i + 1}`,
              slug: `school-${(page - 1) * 1000 + i + 1}`,
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
    const schoolUrls = entries.filter((e) => e.url.includes("/schools/"));

    // Confirms pagination did NOT truncate at 10,000 and reached 11,000
    expect(schoolUrls.length).toBe(11000);
    expect(schoolUrls[10500].url).toBe(`${siteConfig.url}/schools/school-10501`);
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
            const count = page === 3 ? 50 : 100;
            const combos = Array.from({ length: count }, (_, i) => ({
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

    expect(comboUrls.length).toBe(250);
    expect(comboUrls.some((e) => e.url.includes("combo-p2-"))).toBe(true);
    expect(comboUrls.some((e) => e.url.includes("combo-p3-"))).toBe(true);
  });

  it("fails with an integrity error when a school is missing its canonical slug", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("/track-profiles")) return Response.json({ data: [] });
      if (url.includes("/combinations")) return Response.json({ data: { data: [], meta: { total: 0, totalPages: 0 } } });
      if (url.includes("/schools")) {
        return Response.json({ data: { data: [{ id: "school-1" }], meta: { total: 1, totalPages: 1 } } });
      }
      return Response.json({ data: [] });
    }));

    await expect(sitemap()).rejects.toThrow(/school school-1 has no valid canonical slug/i);
  });

  it("does not return a partial sitemap when the school API is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("/schools")) return Response.json({}, { status: 503 });
      if (url.includes("/combinations")) return Response.json({ data: { data: [], meta: { total: 0, totalPages: 0 } } });
      return Response.json({ data: [] });
    }));

    await expect(sitemap()).rejects.toThrow(/could not load schools page 1.*503/i);
  });
});
