import { prisma } from "../db/client.mjs";

/**
 * Get all subject combinations offered by a school (by school ID).
 * Groups combinations by track for easy frontend rendering.
 */
export async function getSchoolCombinationsHandler(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: {
      id: true,
      name: true,
      Combinations: {
        include: {
          track: { select: { id: true, name: true, pathway: true } },
          Subjects: { select: { name: true } },
          profile: { select: { overview: true, careerPathways: true } },
        },
        orderBy: { code: "asc" },
      },
    },
  });

  if (!school) return null;

  // Group combinations by track
  const byTrack: Record<string, {
    trackId: string;
    trackName: string;
    pathway: string;
    combinations: typeof school.Combinations;
  }> = {};

  for (const combo of school.Combinations) {
    const key = combo.track.id;
    if (!byTrack[key]) {
      byTrack[key] = {
        trackId: combo.track.id,
        trackName: combo.track.name,
        pathway: combo.track.pathway,
        combinations: [],
      };
    }
    byTrack[key].combinations.push(combo);
  }

  return {
    schoolId: school.id,
    schoolName: school.name,
    totalCombinations: school.Combinations.length,
    byTrack: Object.values(byTrack),
  };
}
