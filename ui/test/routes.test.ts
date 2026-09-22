import { describe, expect, it } from "vitest";
import { getCombinationUrl, getSchoolCanonicalUrl, getSchoolUrl, getTrackUrl } from "@/lib/routes";
import { siteConfig } from "@/lib/seo";

describe("Central Route Builder", () => {
  it("builds canonical school URL from school object with slug", () => {
    const school = {
      id: "5551803899c0e4c0b9503bb93786fa4874707e7d61a24cee63d9ecc560475923",
      slug: "alliance-high-school",
    };
    expect(getSchoolUrl(school)).toBe("/schools/alliance-high-school");
    expect(getSchoolCanonicalUrl(school)).toBe(
      `${siteConfig.url}/schools/alliance-high-school`
    );
  });

  it("builds canonical school URL directly from slug string", () => {
    expect(getSchoolUrl("st-marys-secondary-school-kitui")).toBe(
      "/schools/st-marys-secondary-school-kitui"
    );
    expect(getSchoolCanonicalUrl("st-marys-secondary-school-kitui")).toBe(
      `${siteConfig.url}/schools/st-marys-secondary-school-kitui`
    );
  });

  it("throws data integrity error when school slug is missing or empty (never falls back to ID)", () => {
    const invalidSchool = {
      id: "5551803899c0e4c0b9503bb93786fa4874707e7d61a24cee63d9ecc560475923",
      slug: "",
    };
    expect(() => getSchoolUrl(invalidSchool)).toThrowError(
      /data integrity error/i
    );
    expect(() => getSchoolUrl("   ")).toThrowError(
      /data integrity error/i
    );
  });

  it("builds track and combination URLs cleanly", () => {
    expect(getTrackUrl("pure-sciences")).toBe("/explore-tracks/pure-sciences");
    expect(getCombinationUrl("bio-chem-phy")).toBe("/combination/bio-chem-phy");
  });
});
