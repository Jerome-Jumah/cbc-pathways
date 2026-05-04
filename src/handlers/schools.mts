import { prisma } from "../db/client.mjs";
import { Prisma } from "../generated/prisma/client.js";
import { SchoolWhereInput } from "../generated/prisma/models.js";
import { GetSchoolsQuery } from "../schemas/api.mjs";

type RankedSchoolRow = {
  id: string;
  score: number;
  matched_recommended_combination: boolean;
  matched_subject_count: number;
  matched_preferred_track: boolean;
};

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
    sort,
  } = filters;

  const hasRecommendationContext = recommendedCombinationIds.length > 0 || Boolean(preferredTrack);
  if (hasRecommendationContext) {
    return getRankedRecommendationSchools(filters);
  }

  // Build the dynamic WHERE clause
  const whereClause: SchoolWhereInput = {};
  const andFilters: SchoolWhereInput[] = [];

  if (county) whereClause.county = { equals: county, mode: "insensitive" };
  if (gender) whereClause.gender = { equals: gender, mode: "insensitive" };
  if (accommodation) whereClause.accommodationType = { equals: accommodation, mode: "insensitive" };
  if (category) whereClause.category = { equals: category, mode: "insensitive" };
  if (cluster) whereClause.cluster = { equals: cluster, mode: "insensitive" };
  if (search) {
    andFilters.push({
      OR: [{ name: { contains: search, mode: "insensitive" } }, { county: { contains: search, mode: "insensitive" } }],
    });
  }

  // Relational Filtering: Track and Subjects
  if (track || subjects.length > 0) {
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

  const [total, schools] = await Promise.all([
    prisma.school.count({ where: whereClause }),
    prisma.school.findMany({
      where: whereClause,
      skip,
      take: limit,
      // Include the combinations so the frontend can see WHY this school matched
      include: {
        Combinations: {
          select: { id: true, code: true, track: { select: { name: true } }, Subjects: { select: { name: true } } },
        },
      },
      orderBy: sort === "county" ? [{ county: "asc" }, { name: "asc" }] : { name: "asc" },
    }),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: schools.map(school => ({ ...school, score: undefined, matchReasons: [] as string[] })),
  };
}

async function getRankedRecommendationSchools(filters: GetSchoolsQuery) {
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
    sort,
  } = filters;

  const skip = (page - 1) * limit;
  const baseConditions: Prisma.Sql[] = [];
  const candidateConditions: Prisma.Sql[] = [];
  const upperSubjects = subjects.map(subject => subject.toUpperCase());

  if (county) baseConditions.push(Prisma.sql`lower(s.county) = lower(${county})`);
  if (gender) baseConditions.push(Prisma.sql`lower(s.gender) = lower(${gender})`);
  if (accommodation) baseConditions.push(Prisma.sql`lower(s.accommodation_type) = lower(${accommodation})`);
  if (category) baseConditions.push(Prisma.sql`lower(s.category) = lower(${category})`);
  if (cluster) baseConditions.push(Prisma.sql`lower(s.cluster) = lower(${cluster})`);
  if (search) {
    const pattern = `%${search}%`;
    baseConditions.push(Prisma.sql`(s.name ILIKE ${pattern} OR s.county ILIKE ${pattern})`);
  }

  if (recommendedCombinationIds.length > 0) {
    candidateConditions.push(Prisma.sql`cs."B"::text IN (${Prisma.join(recommendedCombinationIds)})`);
  }

  if (upperSubjects.length > 0) {
    candidateConditions.push(Prisma.sql`upper(sub.name) IN (${Prisma.join(upperSubjects)})`);
  }

  if (preferredTrack) {
    candidateConditions.push(Prisma.sql`lower(t.name) = lower(${preferredTrack})`);
  }

  if (track) {
    candidateConditions.push(Prisma.sql`lower(t.name) = lower(${track})`);
  }

  const allConditions = [
    ...baseConditions,
    ...(candidateConditions.length > 0 ? [Prisma.sql`(${Prisma.join(candidateConditions, " OR ")})`] : []),
  ];
  const whereSql =
    allConditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(allConditions, " AND ")}`
      : Prisma.empty;
  const recommendedScoreSql =
    recommendedCombinationIds.length > 0
      ? Prisma.sql`CASE WHEN bool_or(cs."B"::text IN (${Prisma.join(recommendedCombinationIds)})) THEN 50 ELSE 0 END`
      : Prisma.sql`0`;
  const subjectScoreSql =
    upperSubjects.length > 0
      ? Prisma.sql`LEAST(25, COUNT(DISTINCT sub.name) FILTER (WHERE upper(sub.name) IN (${Prisma.join(upperSubjects)}))::int * 8)`
      : Prisma.sql`0`;
  const preferredTrackScoreSql = preferredTrack
    ? Prisma.sql`CASE WHEN bool_or(lower(t.name) = lower(${preferredTrack})) THEN 10 ELSE 0 END`
    : Prisma.sql`0`;
  const matchedRecommendedSql =
    recommendedCombinationIds.length > 0
      ? Prisma.sql`bool_or(cs."B"::text IN (${Prisma.join(recommendedCombinationIds)}))`
      : Prisma.sql`false`;
  const matchedSubjectsSql =
    upperSubjects.length > 0
      ? Prisma.sql`COUNT(DISTINCT sub.name) FILTER (WHERE upper(sub.name) IN (${Prisma.join(upperSubjects)}))::int`
      : Prisma.sql`0`;
  const matchedTrackSql = preferredTrack
    ? Prisma.sql`bool_or(lower(t.name) = lower(${preferredTrack}))`
    : Prisma.sql`false`;
  const orderSql =
    sort === "name"
      ? Prisma.sql`lower(s.name) ASC`
      : sort === "county"
        ? Prisma.sql`lower(s.county) ASC, lower(s.name) ASC`
        : Prisma.sql`score DESC, lower(s.name) ASC`;

  const baseCte = Prisma.sql`
    WITH candidate_schools AS (
      SELECT DISTINCT s.id
      FROM schools s
      JOIN "_CombinationSchools" cs ON cs."A" = s.id
      JOIN subject_combinations sc ON sc.id = cs."B"
      JOIN tracks t ON t.id = sc."trackId"
      LEFT JOIN "_CombinationSubjects" csub ON csub."B" = sc.id
      LEFT JOIN subjects sub ON sub.id = csub."A"
      ${whereSql}
    ),
    scored_schools AS (
      SELECT
        s.id,
        (${recommendedScoreSql} + ${subjectScoreSql} + ${preferredTrackScoreSql})::int AS score,
        ${matchedRecommendedSql} AS matched_recommended_combination,
        ${matchedSubjectsSql} AS matched_subject_count,
        ${matchedTrackSql} AS matched_preferred_track
      FROM schools s
      JOIN "_CombinationSchools" cs ON cs."A" = s.id
      JOIN subject_combinations sc ON sc.id = cs."B"
      JOIN tracks t ON t.id = sc."trackId"
      LEFT JOIN "_CombinationSubjects" csub ON csub."B" = sc.id
      LEFT JOIN subjects sub ON sub.id = csub."A"
      WHERE s.id IN (SELECT id FROM candidate_schools)
      GROUP BY s.id
    )
  `;

  const [countRows, rankedRows] = await Promise.all([
    prisma.$queryRaw<Array<{ total: bigint }>>(Prisma.sql`${baseCte} SELECT COUNT(*) AS total FROM scored_schools`),
    prisma.$queryRaw<RankedSchoolRow[]>(
      Prisma.sql`
        ${baseCte}
        SELECT
          ss.id,
          ss.score,
          ss.matched_recommended_combination,
          ss.matched_subject_count,
          ss.matched_preferred_track
        FROM scored_schools ss
        JOIN schools s ON s.id = ss.id
        ORDER BY ${orderSql}
        LIMIT ${limit}
        OFFSET ${skip}
      `,
    ),
  ]);

  const total = Number(countRows[0]?.total ?? 0);
  const rankedById = new Map(rankedRows.map(row => [row.id, row]));
  const ids = rankedRows.map(row => row.id);

  if (ids.length === 0) {
    return {
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data: [],
    };
  }

  const schools = await prisma.school.findMany({
    where: { id: { in: ids } },
    include: {
      Combinations: {
        select: { id: true, code: true, track: { select: { name: true } }, Subjects: { select: { name: true } } },
      },
    },
  });
  const schoolsById = new Map(schools.map(school => [school.id, school]));

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: ids.flatMap(id => {
      const school = schoolsById.get(id);
      const ranked = rankedById.get(id);
      if (!school || !ranked) return [];

      const matchReasons: string[] = [];
      if (ranked.matched_recommended_combination) matchReasons.push("Offers your recommended combination");
      if (ranked.matched_subject_count > 0) matchReasons.push("Matches your selected subjects");
      if (ranked.matched_preferred_track) matchReasons.push("Matches your preferred track");
      if (county) matchReasons.push("Matches selected county");
      if (gender) matchReasons.push("Matches selected gender");
      if (cluster) matchReasons.push("Matches selected cluster");

      return [{ ...school, score: Math.min(ranked.score, 100), matchReasons }];
    }),
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
