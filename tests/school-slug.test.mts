import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { schoolProfileParamsSchema, schoolSlugParamsSchema } from "../src/schemas/school-profile.schema.mjs";
import { parseSchoolRecord, resolveSchoolSlug } from "../src/utils/school-data.mjs";

describe("school slug data and allocation rules", () => {
  it("requires complete, slug-capable school identity data", () => {
    assert.throws(() => parseSchoolRecord({ name: "Alliance High School", county: "", cluster: "C1" }, "test source", 0), /county.*correct the source data/i);
    assert.throws(() => parseSchoolRecord({ name: "Unknown", county: "Kiambu", cluster: "C1" }, "test source", 0), /school name.*correct the source data/i);
    assert.throws(() => parseSchoolRecord({ name: "!!!", county: "Kiambu", cluster: "C1" }, "test source", 0), /cannot form a URL slug/i);
  });

  it("reads the supported source field names and retains optional fields", () => {
    const school = parseSchoolRecord({
      senior_school_name: " Alliance High School ",
      county: "Kiambu",
      cluster: "C1",
      gender: "BOYS",
      category: "National",
      accomodation_type: "Boarding",
    }, "test source", 0);

    assert.equal(school.name, "Alliance High School");
    assert.equal(school.gender, "BOYS");
    assert.equal(school.accommodationType, "Boarding");
  });

  it("uses name, county, cluster, then numeric suffixes as explicit collision rules", async () => {
    const school = { name: "St. Mary's School", county: "Kiambu", cluster: "C1" };
    const taken = new Set(["st-marys-school", "st-marys-school-kiambu"]);

    const slug = await resolveSchoolSlug(school, candidate => taken.has(candidate));
    assert.equal(slug, "st-marys-school-kiambu-c1");

    taken.add(slug);
    assert.equal(await resolveSchoolSlug(school, candidate => taken.has(candidate)), "st-marys-school-kiambu-c1-2");
  });

  it("accepts only canonical lowercase school slugs", () => {
    assert.equal(schoolSlugParamsSchema.safeParse({ slug: "alliance-high-school" }).success, true);
    for (const slug of ["", "Alliance-High-School", "school--name", "school/name"]) {
      assert.equal(schoolSlugParamsSchema.safeParse({ slug }).success, false);
    }
  });

  it("accepts school IDs only on the explicit ID route", () => {
    const schoolId = "a".repeat(64);
    assert.equal(schoolProfileParamsSchema.safeParse({ schoolId }).success, true);
    assert.equal(schoolProfileParamsSchema.safeParse({ schoolId: "00000000-0000-4000-8000-000000000201" }).success, false);
  });
});
