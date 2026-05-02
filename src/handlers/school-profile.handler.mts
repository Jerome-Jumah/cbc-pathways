import { prisma } from "../db/client.mjs";
import { UpsertSchoolProfileInput } from "../schemas/school-profile.schema.mjs";

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function getSchoolProfileHandler(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      profile: true,
      _count: { select: { Combinations: true } },
      Combinations: {
        select: {
          track: { select: { name: true } },
        },
      },
    },
  });

  if (!school) return null;

  // Derive unique track names from combinations
  const tracksOffered = [...new Set(school.Combinations.map(c => c.track.name))].sort();

  return {
    school: {
      id: school.id,
      name: school.name,
      county: school.county,
      cluster: school.cluster,
      gender: school.gender,
      category: school.category,
      accommodationType: school.accommodationType,
      combinationCount: school._count.Combinations,
      tracksOffered,
    },
    profile: school.profile,
  };
}

// ─── UPSERT ──────────────────────────────────────────────────────────────────

export async function upsertSchoolProfileHandler(input: { schoolId: string; data: UpsertSchoolProfileInput }) {
  const { schoolId, data } = input;

  // Confirm school exists first
  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
  if (!school) return null;

  // Set lastVerifiedAt automatically when a source is provided
  const lastVerifiedAt = data.sourceUrl || data.sourceType ? new Date() : undefined;

  const profile = await prisma.schoolProfile.upsert({
    where: { schoolId },
    create: {
      schoolId,
      ...data,
      highlights: data.highlights ?? [],
      lastVerifiedAt,
    },
    update: {
      ...data,
      ...(lastVerifiedAt && { lastVerifiedAt }),
    },
  });

  return profile;
}
