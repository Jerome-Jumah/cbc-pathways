import { prisma } from '../db/client.mjs';

export interface GetSchoolsFilters {
  track?: string;
  county?: string;
  gender?: string;
  subjects?: string[];
}

export const getSchoolsHandler = async (filters: GetSchoolsFilters) => {
  const { track, county, gender, subjects } = filters;

  // Build the filter object for Prisma
  const whereClause: any = {};

  if (county) {
    whereClause.county = { equals: county, mode: 'insensitive' };
  }

  if (gender) {
    whereClause.gender = { equals: gender, mode: 'insensitive' };
  }

  const combinationWhereClause: any = {};

  if (track) {
    combinationWhereClause.track = {
      name: { equals: track, mode: 'insensitive' },
    };
  }

  if (subjects && subjects.length > 0) {
    // Uppercase subjects based on normalisation rules
    const upperSubjects = subjects.map(s => s.trim().toUpperCase());
    
    combinationWhereClause.Subjects = {
      some: {
        name: { in: upperSubjects },
      },
    };
  }

  if (Object.keys(combinationWhereClause).length > 0) {
    whereClause.Combinations = {
      some: combinationWhereClause,
    };
  }

  return await prisma.school.findMany({
    where: whereClause,
    include: {
      Combinations: {
        include: {
          track: true,
          Subjects: true,
        },
      },
    },
  });
};

export const getCombinationsBySchoolHandler = async (schoolName: string) => {
  return await prisma.school.findFirst({
    where: {
      name: { equals: schoolName, mode: 'insensitive' },
    },
    include: {
      Combinations: {
        include: {
          track: true,
          Subjects: true,
        },
      },
    },
  });
};

export const getCombinationsBySubjectsHandler = async (subjects: string[]) => {
  const upperSubjects = subjects.map(s => s.trim().toUpperCase());

  return await prisma.subjectCombination.findMany({
    where: {
      Subjects: {
        some: {
          name: { in: upperSubjects },
        },
      },
    },
    include: {
      track: true,
      Subjects: true,
      Schools: true,
    },
  });
};
