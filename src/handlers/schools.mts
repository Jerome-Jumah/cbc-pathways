import { prisma } from "../db/client.mjs";
import { SchoolWhereInput } from "../generated/prisma/models.js";
import { GetSchoolsQuery } from "../schemas/api.mjs";

// TODO: handle this in a better way - we should be able to just use the same query for both regular searching and recommendation results, but the ranking logic is making it complicated. Maybe we can do the ranking in a separate step after fetching the data, or use a more advanced Prisma query to calculate relevance scores directly in the database.
export async function getSchoolsHandler(filters: GetSchoolsQuery) {
  const {
    search,
    track,
    county,
    gender,
    accommodation,
    category,
    subjects,
    page,
    limit,
    cluster,
    preferredTrack,
    recommendedCombinationIds,
  } = filters;

  // Build the dynamic WHERE clause
  const whereClause: SchoolWhereInput = {};
  const andFilters: SchoolWhereInput[] = [];
  const hasRecommendationContext = recommendedCombinationIds.length > 0 || Boolean(preferredTrack);

  if (county && !hasRecommendationContext) whereClause.county = { equals: county, mode: "insensitive" };
  if (gender && !hasRecommendationContext) whereClause.gender = { equals: gender, mode: "insensitive" };
  if (accommodation) whereClause.accommodationType = { equals: accommodation, mode: "insensitive" };
  if (category) whereClause.category = { equals: category, mode: "insensitive" };
  if (cluster && !hasRecommendationContext) whereClause.cluster = { equals: cluster, mode: "insensitive" };
  if (search) {
    andFilters.push({
      OR: [{ name: { contains: search, mode: "insensitive" } }, { county: { contains: search, mode: "insensitive" } }],
    });
  }

  // Relational Filtering: Track and Subjects
  if (hasRecommendationContext) {
    const recommendationMatchers: SchoolWhereInput[] = [];

    if (recommendedCombinationIds.length > 0) {
      recommendationMatchers.push({
        Combinations: { some: { id: { in: recommendedCombinationIds } } },
      });
    }

    if (subjects.length > 0) {
      recommendationMatchers.push({
        Combinations: {
          some: {
            Subjects: {
              some: { name: { in: subjects, mode: "insensitive" } },
            },
          },
        },
      });
    }

    if (preferredTrack) {
      recommendationMatchers.push({
        Combinations: { some: { track: { name: { equals: preferredTrack, mode: "insensitive" } } } },
      });
    }

    if (track) {
      recommendationMatchers.push({
        Combinations: { some: { track: { name: { equals: track, mode: "insensitive" } } } },
      });
    }

    if (recommendationMatchers.length > 0) {
      andFilters.push({ OR: recommendationMatchers });
    }
  } else if (track || subjects.length > 0) {
    andFilters.push({
      Combinations: {
        some: {
          ...(track && { track: { name: { equals: track, mode: "insensitive" } } }),
          ...(subjects.length > 0 && {
            // The combination MUST have EVERY subject the user requested.
            AND: subjects.map(subjectName => ({
              Subjects: { some: { name: { equals: subjectName, mode: "insensitive" } } },
            })),
          }),
        },
      },
    });
  }

  if (andFilters.length > 0) {
    whereClause.AND = andFilters;
  }

  // Execute Query with Pagination
  const skip = (page - 1) * limit;
  const shouldRank = hasRecommendationContext || subjects.length > 0 || county || gender || cluster;
  const querySkip = shouldRank ? 0 : skip;
  const queryTake = shouldRank ? Math.max(skip + limit, limit) : limit;

  const [total, schools] = await Promise.all([
    prisma.school.count({ where: whereClause }),
    prisma.school.findMany({
      where: whereClause,
      skip: querySkip,
      take: queryTake,
      // Include the combinations so the frontend can see WHY this school matched
      include: {
        Combinations: {
          select: { id: true, code: true, track: { select: { name: true } }, Subjects: { select: { name: true } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const rankedSchools = shouldRank
    ? schools
        .map(school => {
          let score = 0;
          const matchReasons: string[] = [];
          const combinationIds = school.Combinations.map(combination => combination.id);
          const schoolSubjects = new Set(
            school.Combinations.flatMap(combination => combination.Subjects.map(subject => subject.name.toUpperCase())),
          );

          if (recommendedCombinationIds.some(id => combinationIds.includes(id))) {
            score += 50;
            matchReasons.push("Offers your recommended combination");
          }

          const matchedSubjectCount = subjects.filter(subject => schoolSubjects.has(subject.toUpperCase())).length;
          if (matchedSubjectCount > 0) {
            score += Math.min(25, matchedSubjectCount * 8);
            matchReasons.push("Matches your selected subjects");
          }

          if (
            preferredTrack &&
            school.Combinations.some(combination => combination.track.name.toLowerCase() === preferredTrack.toLowerCase())
          ) {
            score += 10;
            matchReasons.push("Matches your preferred track");
          }

          if (county && school.county.toLowerCase() === county.toLowerCase()) {
            score += 8;
            matchReasons.push("Matches selected county");
          }

          if (gender && school.gender?.toLowerCase() === gender.toLowerCase()) {
            score += 5;
            matchReasons.push("Matches selected gender");
          }

          if (cluster && school.cluster?.toLowerCase() === cluster.toLowerCase()) {
            score += 5;
            matchReasons.push("Matches selected cluster");
          }

          return { ...school, score: Math.min(score, 100), matchReasons };
        })
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    : schools.map(school => ({ ...school, score: undefined, matchReasons: [] as string[] }));

  const pagedSchools = shouldRank ? rankedSchools.slice(skip, skip + limit) : rankedSchools;

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: pagedSchools,
  };
}

export async function getCombinationsBySchoolHandler(schoolName: string) {
  return await prisma.school.findMany({
    where: {
      name: { equals: schoolName, mode: "insensitive" },
    },
    include: {
      Combinations: {
        include: {
          track: { select: { name: true, pathway: true } },
          Subjects: { select: { name: true } },
        },
      },
    },
  });
}

export async function getCombinationsBySubjectsHandler(subjects: string[]) {
  const upperSubjects = subjects.map(s => s.trim().toUpperCase());

  return await prisma.subjectCombination.findMany({
    where: {
      AND: upperSubjects.map(subjectName => ({ Subjects: { some: { name: subjectName } } })),
    },
    include: {
      track: { select: { name: true, pathway: true } },
      Subjects: { select: { name: true } },
      Schools: { select: { name: true } },
    },
  });
}
