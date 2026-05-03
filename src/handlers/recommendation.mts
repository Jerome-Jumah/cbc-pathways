import { prisma } from "../db/client.mjs";
import { RecommendationRequest } from "../schemas/api.mjs";

export async function generateRecommendationsHandler(input: RecommendationRequest) {
  const { preferredSubjects, preferredCounty, preferredCategory, gender } = input;

  // 1. Find Combinations that overlap with the student's preferred subjects
  const matchingCombinations = await prisma.subjectCombination.findMany({
    where: {
      Subjects: {
        some: { name: { in: preferredSubjects } },
      },
    },
    include: {
      track: { select: { name: true, pathway: true } },
      Subjects: { select: { name: true } },
      // Count how many schools actually offer this combination
      _count: { select: { Schools: true } },
    },
  });

  // 2. Score and Sort the Combinations
  // A perfect match is 3/3 subjects. A partial match is 1/3 or 2/3.
  const scoredCombinations = matchingCombinations
    .map(combo => {
      const comboSubjects = combo.Subjects.map(s => s.name);
      const matchCount = comboSubjects.filter(sub => preferredSubjects.includes(sub)).length;

      return {
        ...combo,
        matchScore: Math.round((matchCount / 3) * 100), // Percentage match
        matchedSubjects: comboSubjects.filter(sub => preferredSubjects.includes(sub)),
      };
    })
    // Remove orphans (0 schools) and sort by best match
    .filter(c => c._count.Schools > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // Take the top 5 best pathways

  // 3. Fetch specific schools for these top combinations based on user preferences
  const topCombinationIds = scoredCombinations.map(c => c.id);

  const recommendedSchools = await prisma.school.findMany({
    where: {
      ...(preferredCounty && { county: { equals: preferredCounty, mode: "insensitive" } }),
      ...(preferredCategory && { category: { equals: preferredCategory, mode: "insensitive" } }),
      ...(gender && { gender: { equals: gender, mode: "insensitive" } }),
      Combinations: {
        some: { id: { in: topCombinationIds } },
      },
    },
    select: {
      name: true,
      county: true,
      category: true,
      Combinations: {
        where: { id: { in: topCombinationIds } },
        select: { code: true, track: { select: { name: true } } },
      },
    },
    take: 10, // Give them 10 highly relevant school options
  });

  return {
    pathwayRecommendations: scoredCombinations,
    schoolOptions: recommendedSchools,
  };
}
