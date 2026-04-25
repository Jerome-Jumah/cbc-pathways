import { prisma } from "./db/client.mjs";

const runAudit = async () => {
  try {
    console.log("📊 Auditing Database Integrity...\n");

    // 1. Get raw counts of all core entities
    const trackCount = await prisma.track.count();
    const subjectCount = await prisma.subject.count();
    const combinationCount = await prisma.subjectCombination.count();
    const schoolCount = await prisma.school.count();

    console.log(`=== RAW TOTALS ===`);
    console.log(`📌 Tracks: ${trackCount}`);
    console.log(`📌 Unique Subjects: ${subjectCount}`);
    console.log(`📌 Subject Combinations: ${combinationCount}`);
    console.log(`📌 Unique Schools: ${schoolCount}\n`);

    // 2. The "Makes Sense" Check: Combinations per Track
    // This verifies that Combinations actually got linked to Tracks
    const tracksWithStats = await prisma.track.findMany({
      select: {
        name: true,
        _count: {
          select: { SubjectCombinations: true },
        },
      },
      orderBy: {
        SubjectCombinations: { _count: "desc" },
      },
    });

    console.log(`=== COMBINATIONS PER TRACK ===`);
    tracksWithStats.forEach(track => {
      console.log(`  - ${track.name}: ${track._count.SubjectCombinations} combinations`);
    });

    // 3. The Ultimate Relational Check: Schools with 0 combinations
    // If this is higher than 0, the deduplication or many-to-many linking failed.
    const orphanedSchoolsCount = await prisma.school.count({
      where: {
        Combinations: { none: {} },
      },
    });

    console.log(`\n=== HEALTH WARNINGS ===`);
    console.log(`⚠️ Schools mapped to ZERO combinations: ${orphanedSchoolsCount}`);
    if (orphanedSchoolsCount > 0) {
      console.log("   (If this is > 0, the many-to-many relation failed during ingestion)");
    } else {
      console.log("   (Perfect! Every school belongs to at least one combination)");
    }
  } catch (error) {
    console.error("Error running audit:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

runAudit();
