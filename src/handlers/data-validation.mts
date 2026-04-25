import { prisma } from "../db/client.mjs";

export async function runDataValidationHandler() {
  // 1. Duplicate combinations (by normalized subjects)
  // Subject comes before SubjectCombination alphabetically.
  // So "A" = Subject.id (UUID), "B" = SubjectCombination.id (UUID)
  const duplicateCombinations = await prisma.$queryRaw`
  SELECT normalized, COUNT(*) as count
  FROM (
    SELECT 
      sc.id,
      STRING_AGG(s.name, '|' ORDER BY s.name) as normalized
    FROM subject_combinations sc
    JOIN "_CombinationSubjects" cs ON cs."B" = sc.id
    JOIN subjects s ON s.id = cs."A"
    GROUP BY sc.id
  ) t
  GROUP BY normalized
  HAVING COUNT(*) > 1;
`;

  // 2. Orphan combinations (no schools)
  // School comes before SubjectCombination alphabetically.
  // So "A" = School.id (String/SHA256), "B" = SubjectCombination.id (UUID)
  const orphanCombinations = await prisma.$queryRaw<{ count: bigint }[]>`
  SELECT COUNT(*) as count
  FROM subject_combinations sc
  LEFT JOIN "_CombinationSchools" cs 
    ON cs."B" = sc.id
  WHERE cs."B" IS NULL;
`;

  // 3. Orphan schools (not linked to any combination)
  const orphanSchools = await prisma.$queryRaw<{ count: bigint }[]>`
  SELECT COUNT(*) as count
  FROM schools s
  LEFT JOIN "_CombinationSchools" cs 
    ON cs."A" = s.id
  WHERE cs."A" IS NULL;
`;

  // 4. Invalid subject counts per combination
  // Checking "_CombinationSubjects", where "B" is the Combination
  const invalidSubjectCounts = await prisma.$queryRaw`
   SELECT cs."B" as combination_id, COUNT(*) as subject_count
  FROM "_CombinationSubjects" cs
  GROUP BY cs."B"
  HAVING COUNT(*) != 3;
`;

  // 5. Duplicate schools
  const duplicateSchools = await prisma.$queryRaw`
  SELECT name, county, cluster, COUNT(*) as count
  FROM schools
  GROUP BY name, county, cluster
  HAVING COUNT(*) > 1;
`;

  // 6. Top combinations by school count
  const schoolDistribution = await prisma.$queryRaw<
    {
      combination_id: string;
      school_count: bigint;
    }[]
  >`
  SELECT 
    sc.id as combination_id,
    COUNT(cs."A") as school_count
  FROM subject_combinations sc
  JOIN "_CombinationSchools" cs 
    ON cs."B" = sc.id
  GROUP BY sc.id
  ORDER BY school_count DESC
  LIMIT 10;
`;

  // 7. Null track check
  const nullTracks = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM subject_combinations
    WHERE "trackId" IS NULL;
  `;

  // 8. Summary counts (quick sanity)
  const totals = await prisma.$queryRaw<
    {
      tracks: bigint;
      subjects: bigint;
      combinations: bigint;
      schools: bigint;
    }[]
  >`
    SELECT
      (SELECT COUNT(*) FROM tracks) as tracks,
      (SELECT COUNT(*) FROM subjects) as subjects,
      (SELECT COUNT(*) FROM subject_combinations) as combinations,
      (SELECT COUNT(*) FROM schools) as schools
  `;

  // Convert BigInt → Number safely
  const toNumber = (val: bigint) => Number(val);

  return {
    status: "ok",

    totals: {
      tracks: toNumber(totals[0].tracks),
      subjects: toNumber(totals[0].subjects),
      combinations: toNumber(totals[0].combinations),
      schools: toNumber(totals[0].schools),
    },

    issues: {
      duplicateCombinations: Array.isArray(duplicateCombinations) ? duplicateCombinations.length : 0,
      orphanCombinations: toNumber(orphanCombinations[0].count),
      orphanSchools: toNumber(orphanSchools[0].count),
      invalidSubjectCounts: Array.isArray(invalidSubjectCounts) ? invalidSubjectCounts.length : 0,
      duplicateSchools: Array.isArray(duplicateSchools) ? duplicateSchools.length : 0,
      nullTracks: toNumber(nullTracks[0].count),
    },

    details: {
      duplicateCombinations,
      invalidSubjectCounts,
      duplicateSchools,
      topCombinationsBySchools: schoolDistribution.map(row => ({
        combinationId: row.combination_id,
        schoolCount: toNumber(row.school_count),
      })),
    },
  };
}
