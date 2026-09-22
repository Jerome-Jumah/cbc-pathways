import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../src/db/client.mjs";
import { getSchoolCombinationsByIdHandler, getSchoolCombinationsBySlugHandler } from "../src/handlers/school-combinations.handler.mjs";
import { getSchoolProfileByIdHandler, getSchoolProfileBySlugHandler } from "../src/handlers/school-profile.handler.mjs";

const schoolId = "a".repeat(64);
const schoolSlug = "alliance-high-school";
const schoolRow = {
  id: schoolId,
  slug: schoolSlug,
  name: "Alliance High School",
  county: "Kiambu",
  cluster: "C1",
  gender: "BOYS",
  category: "National",
  accommodationType: "Boarding",
  profile: null,
  _count: { Combinations: 0 },
  Combinations: [],
};

test("school profile lookup uses an explicit unique ID or slug query", async () => {
  const schoolDelegate = prisma.school;
  const originalFindUnique = schoolDelegate.findUnique;
  const lookups: unknown[] = [];
  schoolDelegate.findUnique = (async args => {
    lookups.push(args.where);
    return schoolRow;
  }) as typeof originalFindUnique;
  try {
    await getSchoolProfileByIdHandler(schoolId);
    await getSchoolProfileBySlugHandler(schoolSlug);

    assert.deepEqual(lookups, [
      { id: schoolId },
      { slug: schoolSlug },
    ]);
  } finally {
    schoolDelegate.findUnique = originalFindUnique;
  }
});

test("school combinations lookup uses an explicit unique ID or slug query", async () => {
  const schoolDelegate = prisma.school;
  const originalFindUnique = schoolDelegate.findUnique;
  const lookups: unknown[] = [];
  schoolDelegate.findUnique = (async args => {
    lookups.push(args.where);
    return schoolRow;
  }) as typeof originalFindUnique;
  try {
    await getSchoolCombinationsByIdHandler(schoolId);
    await getSchoolCombinationsBySlugHandler(schoolSlug);

    assert.deepEqual(lookups, [
      { id: schoolId },
      { slug: schoolSlug },
    ]);
  } finally {
    schoolDelegate.findUnique = originalFindUnique;
  }
});
