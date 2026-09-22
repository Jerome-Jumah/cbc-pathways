import { describe, expect, it, vi } from "vitest";

const mockPermanentRedirect = vi.fn();
const mockNotFound = vi.fn();

vi.mock("next/navigation", () => ({
  permanentRedirect: (url: string) => mockPermanentRedirect(url),
  notFound: () => mockNotFound(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/schools/test",
  useSearchParams: () => new URLSearchParams(),
}));

const mockGetSchoolProfileById = vi.fn();
const mockGetSchoolProfileBySlug = vi.fn();

vi.mock("@/lib/api/server", () => ({
  getSchoolProfileById: (id: string) => mockGetSchoolProfileById(id),
  getSchoolProfileBySlug: (slug: string) => mockGetSchoolProfileBySlug(slug),
}));

import LegacySchoolRedirectPage from "@/app/school/[id]/page";
import { generateMetadata as generateCanonicalMetadata } from "@/app/schools/[slug]/page";
import { siteConfig } from "@/lib/seo";

describe("School Routing & Redirects", () => {
  it("permanently redirects legacy school ID to canonical /schools/[slug]", async () => {
    mockGetSchoolProfileById.mockResolvedValueOnce({
      school: {
        id: "5551803899c0e4c0b9503bb93786fa4874707e7d61a24cee63d9ecc560475923",
        slug: "alliance-high-school",
        name: "Alliance High School",
        county: "Kiambu",
      },
    });

    await LegacySchoolRedirectPage({
      params: Promise.resolve({
        id: "5551803899c0e4c0b9503bb93786fa4874707e7d61a24cee63d9ecc560475923",
      }),
    });

    expect(mockPermanentRedirect).toHaveBeenCalledWith("/schools/alliance-high-school");
  });

  it("triggers notFound when legacy school ID does not exist", async () => {
    mockGetSchoolProfileById.mockResolvedValueOnce(null);

    await LegacySchoolRedirectPage({
      params: Promise.resolve({ id: "non-existent-id" }),
    });

    expect(mockNotFound).toHaveBeenCalled();
  });

  it("generates canonical metadata pointing to /schools/[slug]", async () => {
    mockGetSchoolProfileBySlug.mockResolvedValueOnce({
      school: {
        id: "12345",
        slug: "alliance-high-school",
        name: "Alliance High School",
        county: "Kiambu",
        combinationCount: 12,
        tracksOffered: ["Pure Sciences", "Applied Sciences"],
      },
    });

    const meta = await generateCanonicalMetadata({
      params: Promise.resolve({ slug: "alliance-high-school" }),
    });

    expect(meta.title).toBe("Alliance High School | CBC Subject Combinations & School Details");
    expect(meta.alternates?.canonical).toBe(
      `${siteConfig.url}/schools/alliance-high-school`
    );
    expect(meta.openGraph?.url).toBe(
      `${siteConfig.url}/schools/alliance-high-school`
    );
  });
});
