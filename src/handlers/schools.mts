import { prisma } from "../db/client.mjs";
import { SchoolWhereInput } from "../generated/prisma/models.js";
import { GetSchoolsQuery } from "../schemas/api.mjs";

export async function getSchoolsHandler(filters: GetSchoolsQuery) {
  const { track, county, gender, category, subjects, page, limit } = filters;

  // Build the dynamic WHERE clause
  const whereClause: SchoolWhereInput = {};

  if (county) whereClause.county = { equals: county, mode: "insensitive" };
  if (gender) whereClause.gender = { equals: gender, mode: "insensitive" };
  if (category) whereClause.category = { equals: category, mode: "insensitive" };

  // Relational Filtering: Track and Subjects
  if (track || subjects.length > 0) {
    whereClause.Combinations = {
      some: {
        ...(track && { track: { name: { equals: track, mode: "insensitive" } } }),
        ...(subjects.length > 0 && {
          // The combination MUST have EVERY subject the user requested
          AND: subjects.map(subjectName => ({
            Subjects: { some: { name: subjectName } },
          })),
        }),
      },
    };
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
          select: { code: true, track: { select: { name: true } } },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: schools,
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
