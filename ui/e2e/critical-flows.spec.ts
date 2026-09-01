import { expect, test, type Page } from "@playwright/test";

const ids = {
  track: "00000000-0000-4000-8000-000000000101",
  school: "00000000-0000-4000-8000-000000000201",
  combo: "00000000-0000-4000-8000-000000000301",
};

async function mockApi(page: Page) {
  await page.addInitScript(
    ({ ids }) => {
      const originalFetch = window.fetch.bind(window);
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (!url.includes("/api/")) return originalFetch(input, init);

        const json = (body: unknown, status = 200) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
          });

        const pathname = new URL(url, window.location.origin).pathname;
        if (pathname.endsWith("/api/session/init") || pathname.endsWith("/api/session/verify-turnstile")) {
          return json({
            success: true,
            data: {
              verifiedHuman: true,
              csrfToken: "mock-csrf-token",
            },
          });
        }
        if (/\/api\/schools\/[^/]+\/profile$/.test(pathname)) {
          return json({
            success: true,
            data: {
              school: {
                id: ids.school,
                name: "Nairobi Senior School",
                county: "NAIROBI",
                cluster: "C2",
                gender: "BOYS",
                category: "C2",
                accommodationType: "Boarding",
                combinationCount: 1,
                tracksOffered: ["Pure Sciences"],
              },
              profile: null,
            },
          });
        }
        if (/\/api\/schools\/[^/]+\/combinations$/.test(pathname)) {
          return json({
            success: true,
            data: {
              schoolId: ids.school,
              schoolName: "Nairobi Senior School",
              totalCombinations: 1,
              byTrack: [
                {
                  trackId: ids.track,
                  trackName: "Pure Sciences",
                  pathway: "STEM",
                  combinations: [
                    {
                      id: ids.combo,
                      code: "PCB",
                      track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
                      Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                      profile: null,
                    },
                  ],
                },
              ],
            },
          });
        }
        if (/\/api\/combinations\/[^/]+\/profile$/.test(pathname)) {
          return json({
            success: true,
            data: {
              found: true,
              generated: false,
              combination: {
                id: ids.combo,
                code: "PCB",
                subjects: ["Biology", "Chemistry"],
                track: "Pure Sciences",
                pathway: "STEM",
                schoolCount: 1,
              },
              profile: {
                id: "p1",
                combinationId: ids.combo,
                overview: "Health sciences pathway",
                bestFor: "Science learners",
                difficultyLevel: "Medium",
                      careerPathways: ["Medicine"],
                keyBenefits: ["Strong science base"],
                subjectDetails: [],
                generatedBy: "test",
                promptVersion: "test",
                createdAt: "",
                updatedAt: "",
              },
            },
          });
        }
        if (/\/api\/track-profiles\/[^/]+$/.test(pathname)) {
          return json({
            success: true,
            data: {
              id: ids.track,
              name: "Pure Sciences",
              pathway: "STEM",
              profile: {
                shortDescription: "Science pathway",
                description: "Science pathway",
                highlights: [],
                careerPathways: ["Medicine"],
                recommendedFor: [],
              },
            },
          });
        }
        if (pathname.endsWith("/api/track-profiles")) {
          return json({
            success: true,
            data: [
              {
                id: ids.track,
                name: "Pure Sciences",
                pathway: "STEM",
                profile: {
                  shortDescription: "Science pathway",
                  description: "Science pathway",
                  highlights: [],
                  careerPathways: ["Medicine"],
                  recommendedFor: [],
                },
              },
            ],
          });
        }
        if (pathname.endsWith("/api/recommendations")) {
          return json({
            status: "success",
            data: {
              pathwayRecommendations: [
                {
                  id: ids.combo,
                  code: "PCB",
                  track: { name: "Pure Sciences" },
                  Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                  _count: { Schools: 1 },
                  matchScore: 67,
                  matchedSubjects: ["BIOLOGY"],
                },
              ],
              schoolOptions: [
                {
                  name: "Nairobi Senior School",
                  county: "NAIROBI",
                  category: "C2",
                  Combinations: [{ code: "PCB", track: { name: "Pure Sciences" } }],
                },
              ],
            },
          });
        }
        if (pathname.endsWith("/api/schools")) {
          return json({
            success: true,
            data: {
              meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
              data: [
                {
                  id: ids.school,
                  name: "Nairobi Senior School",
                  county: "NAIROBI",
                  cluster: "C2",
                  gender: "BOYS",
                  category: "C2",
                  accommodationType: "Boarding",
                  Combinations: [{ code: "PCB", track: { name: "Pure Sciences" } }],
                },
              ],
            },
          });
        }
        if (pathname.endsWith("/api/combinations")) {
          return json({
            success: true,
            data: {
              meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
              data: [
                {
                  id: ids.combo,
                  code: "PCB",
                  track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
                  Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                  _count: { Schools: 1 },
                  profile: { difficultyLevel: "Medium", careerPathways: ["Medicine"], overview: "Health sciences pathway" },
                },
              ],
            },
          });
        }
        return json({ error: { message: "Unhandled mock route" } }, 500);
      };
    },
    { ids },
  );

  await page.route("**/*", route => {
    const url = new URL(route.request().url());
    if (!url.pathname.includes("/api/")) return route.continue();

    if (/\/api\/schools\/[^/]+\/profile$/.test(url.pathname)) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            school: {
              id: ids.school,
              name: "Nairobi Senior School",
              county: "NAIROBI",
              cluster: "C2",
              gender: "BOYS",
              category: "C2",
              accommodationType: "Boarding",
              combinationCount: 1,
              tracksOffered: ["Pure Sciences"],
            },
            profile: null,
          },
        },
      });
    }
    if (/\/api\/schools\/[^/]+\/combinations$/.test(url.pathname)) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            schoolId: ids.school,
            schoolName: "Nairobi Senior School",
            totalCombinations: 1,
            byTrack: [
              {
                trackId: ids.track,
                trackName: "Pure Sciences",
                pathway: "STEM",
                combinations: [
                  {
                    id: ids.combo,
                    code: "PCB",
                    track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
                    Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                    profile: null,
                  },
                ],
              },
            ],
          },
        },
      });
    }
    if (/\/api\/combinations\/[^/]+\/profile$/.test(url.pathname)) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            found: true,
            generated: false,
            combination: {
              id: ids.combo,
              code: "PCB",
              subjects: ["Biology", "Chemistry"],
              track: "Pure Sciences",
              pathway: "STEM",
              schoolCount: 1,
            },
            profile: {
              id: "p1",
              combinationId: ids.combo,
              overview: "Health sciences pathway",
              bestFor: "Science learners",
              difficultyLevel: "Medium",
                    careerPathways: ["Medicine"],
              keyBenefits: ["Strong science base"],
              subjectDetails: [],
              generatedBy: "test",
              promptVersion: "test",
              createdAt: "",
              updatedAt: "",
            },
          },
        },
      });
    }
    if (/\/api\/track-profiles\/[^/]+$/.test(url.pathname)) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            id: ids.track,
            name: "Pure Sciences",
            pathway: "STEM",
            profile: {
              shortDescription: "Science pathway",
              description: "Science pathway",
              highlights: [],
              careerPathways: ["Medicine"],
              recommendedFor: [],
            },
          },
        },
      });
    }
    if (url.pathname.endsWith("/api/track-profiles")) {
      return route.fulfill({
        json: {
          success: true,
          data: [
            {
              id: ids.track,
              name: "Pure Sciences",
              pathway: "STEM",
              profile: {
                shortDescription: "Science pathway",
                description: "Science pathway",
                highlights: [],
                careerPathways: ["Medicine"],
                recommendedFor: [],
              },
            },
          ],
        },
      });
    }
    if (url.pathname.endsWith("/api/recommendations")) {
      return route.fulfill({
        json: {
          status: "success",
          data: {
            pathwayRecommendations: [
              {
                id: ids.combo,
                code: "PCB",
                track: { name: "Pure Sciences" },
                Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                _count: { Schools: 1 },
                matchScore: 67,
                matchedSubjects: ["BIOLOGY"],
              },
            ],
            schoolOptions: [
              {
                name: "Nairobi Senior School",
                county: "NAIROBI",
                category: "C2",
                Combinations: [{ code: "PCB", track: { name: "Pure Sciences" } }],
              },
            ],
          },
        },
      });
    }
    if (url.pathname.endsWith("/api/schools")) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
            data: [
              {
                id: ids.school,
                name: "Nairobi Senior School",
                county: "NAIROBI",
                cluster: "C2",
                gender: "BOYS",
                category: "C2",
                accommodationType: "Boarding",
                Combinations: [{ code: "PCB", track: { name: "Pure Sciences" } }],
              },
            ],
          },
        },
      });
    }
    if (url.pathname.endsWith("/api/combinations")) {
      return route.fulfill({
        json: {
          success: true,
          data: {
            meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
            data: [
              {
                id: ids.combo,
                code: "PCB",
                track: { id: ids.track, name: "Pure Sciences", pathway: "STEM" },
                Subjects: [{ name: "Biology" }, { name: "Chemistry" }],
                _count: { Schools: 1 },
                profile: { difficultyLevel: "Medium", careerPathways: ["Medicine"], overview: "Health sciences pathway" },
              },
            ],
          },
        },
      });
    }
    return route.continue();
  });
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("search schools by subject", async ({ page }) => {
  await page.goto("/find-schools?subjects=Biology,Chemistry");
  await expect(page.getByText("Nairobi Senior School")).toBeVisible();
});

test("explore track", async ({ page }) => {
  await page.goto("/explore-tracks");
  await page.getByText("Explore combinations").first().click();
  await expect(page.getByRole("heading", { name: "Subject Combinations" })).toBeVisible();
  await expect(page.getByText("Biology, Chemistry")).toBeVisible();
});

test("school detail", async ({ page }) => {
  await page.goto("/school/00000000-0000-4000-8000-000000000201");
  await expect(page.getByRole("heading", { name: /Tracks Offered/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "Tracks Offered" }).first().click();
  await expect(page.getByRole("heading", { name: "Pure Sciences" })).toBeVisible();
});

test("combination detail", async ({ page }) => {
  await page.goto("/combination/00000000-0000-4000-8000-000000000301");
  await expect(page.getByText("Health sciences pathway")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Schools Offering/ })).toBeVisible();
});

test("recommendation", async ({ page }) => {
  await page.goto("/recommendations");
  await page.getByText("Biology").click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByText("Science & Health").click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByRole("link", { name: /Biology, Chemistry/ })).toBeVisible();
  await expect(page.getByText("Nairobi Senior School")).toBeVisible();
});
