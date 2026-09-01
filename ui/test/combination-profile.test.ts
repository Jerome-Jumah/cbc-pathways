import { afterEach, describe, expect, it, vi } from "vitest";
import { getCombinationProfile } from "@/lib/api/server";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("getCombinationProfile 404 & pending semantics", () => {
  it("returns full profile data when combination profile exists", async () => {
    const mockData = {
      found: true,
      generated: false,
      combination: {
        id: "combo-123",
        code: "PCB",
        subjects: ["Biology", "Chemistry"],
        track: "Pure Sciences",
        pathway: "STEM",
        schoolCount: 5,
      },
      profile: {
        id: "p1",
        combinationId: "combo-123",
        overview: "Health sciences pathway",
        bestFor: "Science learners",
        difficultyLevel: "Medium",
        careerPathways: ["Medicine"],
        keyBenefits: ["Strong science base"],
        subjectDetails: [],
        generatedBy: "system",
        promptVersion: "1.0",
        createdAt: "",
        updatedAt: "",
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ success: true, data: mockData }, { status: 200 }),
      ),
    );

    const result = await getCombinationProfile("combo-123", false);
    expect(result).toEqual(mockData);
    expect(result?.found).toBe(true);
    expect(result?.combination?.code).toBe("PCB");
  });

  it("returns { found: false, combinationExists: true } when combination exists but profile is pending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              message:
                "No profile found for combination 'combo-pending'. Add ?generate=true to generate one.",
            },
          },
          { status: 404 },
        ),
      ),
    );

    const result = await getCombinationProfile("combo-pending", false);
    expect(result).toEqual({ found: false, combinationExists: true });
  });

  it("returns null when combination does not exist (genuine 404)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              message: "Combination with id 'nonexistent-id' not found.",
            },
          },
          { status: 404 },
        ),
      ),
    );

    const result = await getCombinationProfile("nonexistent-id", false);
    expect(result).toBeNull();
  });

  it("re-throws 500 server errors rather than returning null or pending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: { message: "Internal server error" } },
          { status: 500 },
        ),
      ),
    );

    await expect(getCombinationProfile("combo-err", false)).rejects.toMatchObject({
      status: 500,
      message: "Internal server error",
    });
  });
});
