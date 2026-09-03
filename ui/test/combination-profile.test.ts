import { afterEach, describe, expect, it, vi } from "vitest";
import { getCombinationProfile } from "@/lib/api/server";
import { generateMetadata } from "@/app/combination/[id]/page";

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

describe("combination generateMetadata SEO safety", () => {
  it("emits non-indexable metadata when combination does not exist (null returned)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: { message: "Combination with id 'missing-id' not found." } },
          { status: 404 },
        ),
      ),
    );

    const meta = await generateMetadata({ params: Promise.resolve({ id: "missing-id" }) });
    expect(meta.title).toBe("Combination Not Found");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("emits non-indexable metadata when combination exists but profile details are pending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              message: "No profile found for combination 'pending-id'. Add ?generate=true to generate one.",
            },
          },
          { status: 404 },
        ),
      ),
    );

    const meta = await generateMetadata({ params: Promise.resolve({ id: "pending-id" }) });
    expect(meta.title).toBe("Combination Not Found");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("emits indexable rich metadata when combination has profile", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            success: true,
            data: {
              found: true,
              generated: false,
              combination: {
                id: "c1",
                code: "PCB",
                subjects: ["Biology", "Chemistry"],
                track: "Pure Sciences",
                pathway: "STEM",
                schoolCount: 10,
              },
              profile: {
                id: "p1",
                overview: "Health pathway",
              },
            },
          },
          { status: 200 },
        ),
      ),
    );

    const meta = await generateMetadata({ params: Promise.resolve({ id: "c1" }) });
    expect(meta.title).toBe("Biology, Chemistry CBC Combination");
    expect(meta.robots).toEqual({ index: true, follow: true });
  });
});
