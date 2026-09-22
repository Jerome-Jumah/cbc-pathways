import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { generateSchoolId } from "../src/utils/normalizer.mjs";

const testDatabaseUrl = process.env.SCHOOL_SLUG_TEST_DATABASE_URL;

function databaseIdentity(connectionString: string): string {
  const url = new URL(connectionString);
  return `${url.hostname}:${url.port}${url.pathname}`;
}

test("concurrent ingestion allocates unique slugs and preserves existing canonical slugs", {
  skip: !testDatabaseUrl,
}, async () => {
  assert.ok(testDatabaseUrl);
  const appDatabaseUrl = process.env.DATABASE_URL;
  const testDatabase = new URL(testDatabaseUrl);

  assert.match(testDatabase.pathname, /(?:^|[_-])test(?:[_-]|$)/i, "test database name must clearly include 'test'");
  if (appDatabaseUrl) {
    assert.notEqual(databaseIdentity(testDatabaseUrl), databaseIdentity(appDatabaseUrl), "slug integration test must not use DATABASE_URL");
    assert.notEqual(testDatabase.pathname, new URL(appDatabaseUrl).pathname, "slug integration test must use a differently named database");
  }

  const originalDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = testDatabaseUrl;
  const { prisma } = await import("../src/db/client.mjs");
  const { upsertSchoolsForCombination } = await import("../src/services/school-ingestion.mjs");

  let trackId: string | undefined;
  let combinationId: string | undefined;
  const fixtureKey = randomUUID().slice(0, 8);
  const records = [
    { senior_school_name: `St. Mary's School ${fixtureKey}`, county: `Kiambu ${fixtureKey}`, cluster: "C1" },
    { senior_school_name: `St Marys School ${fixtureKey}`, county: `Kiambu ${fixtureKey}`, cluster: "C1" },
  ];
  const schoolIds = records.map(record => generateSchoolId(record.senior_school_name, record.county, record.cluster));

  try {
    const track = await prisma.track.create({ data: { name: `slug-test-${randomUUID()}`, pathway: "Slug test" } });
    trackId = track.id;
    const combination = await prisma.subjectCombination.create({ data: { code: "SLUG-TEST", trackId } });
    combinationId = combination.id;

    await Promise.all(records.map((record, index) =>
      upsertSchoolsForCombination([record], combination.id, `disposable slug test ${index + 1}`),
    ));

    const inserted = await prisma.school.findMany({ where: { id: { in: schoolIds } }, select: { id: true, slug: true } });
    assert.equal(inserted.length, 2);
    assert.equal(new Set(inserted.map(school => school.slug)).size, 2);
    assert.deepEqual(new Set(inserted.map(school => school.slug)), new Set([
      `st-marys-school-${fixtureKey}`,
      `st-marys-school-${fixtureKey}-kiambu-${fixtureKey}`,
    ]));

    const canonicalSlugs = new Map(inserted.map(school => [school.id, school.slug]));
    await upsertSchoolsForCombination([records[0]], combination.id, "disposable slug test rerun");
    const rerun = await prisma.school.findMany({ where: { id: { in: schoolIds } }, select: { id: true, slug: true } });
    assert.deepEqual(new Map(rerun.map(school => [school.id, school.slug])), canonicalSlugs);
  } finally {
    if (schoolIds.length) await prisma.school.deleteMany({ where: { id: { in: schoolIds } } });
    if (combinationId) await prisma.subjectCombination.delete({ where: { id: combinationId } });
    if (trackId) await prisma.track.delete({ where: { id: trackId } });
    await prisma.$disconnect();
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  }
});
