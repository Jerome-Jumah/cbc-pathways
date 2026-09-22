import type { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../db/client.mjs";
import { parseSchoolRecord, resolveSchoolSlug, type SchoolRecord } from "../utils/school-data.mjs";

const SCHOOL_SLUG_LOCK_NAMESPACE = 73151812;
const SCHOOL_SLUG_LOCK_ID = 20260921;

async function allocateSchoolSlug(transaction: Prisma.TransactionClient, school: SchoolRecord): Promise<string> {
  return resolveSchoolSlug(school, async slug => {
    const existing = await transaction.school.findUnique({ where: { slug }, select: { id: true } });
    return existing !== null;
  });
}

/** Upserts one API page of schools under a database-wide slug allocation lock. */
export async function upsertSchoolsForCombination(
  values: readonly unknown[],
  combinationId: string,
  context: string,
): Promise<void> {
  const uniqueSchools = new Map<string, SchoolRecord>();
  values.forEach((value, index) => {
    const school = parseSchoolRecord(value, context, index);
    if (!uniqueSchools.has(school.id)) uniqueSchools.set(school.id, school);
  });

  await prisma.$transaction(async transaction => {
    // Every ingestion process takes this lock before checking slugs or inserting schools.
    // `$executeRaw` deliberately discards the result row. The two-argument
    // PostgreSQL lock function returns `void`, which the Prisma PostgreSQL
    // adapter cannot deserialize through `$queryRaw`.
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(${SCHOOL_SLUG_LOCK_NAMESPACE}::integer, ${SCHOOL_SLUG_LOCK_ID}::integer)`;

    for (const school of uniqueSchools.values()) {
      const existing = await transaction.school.findUnique({ where: { id: school.id }, select: { id: true } });
      if (existing) {
        await transaction.school.update({
          where: { id: school.id },
          data: { Combinations: { connect: { id: combinationId } } },
        });
        continue;
      }

      const slug = await allocateSchoolSlug(transaction, school);
      await transaction.school.create({
        data: {
          id: school.id,
          slug,
          name: school.name,
          county: school.county,
          cluster: school.cluster,
          gender: school.gender,
          category: school.category,
          accommodationType: school.accommodationType,
          Combinations: { connect: { id: combinationId } },
        },
      });
    }
  }, { maxWait: 10_000, timeout: 60_000 });
}
