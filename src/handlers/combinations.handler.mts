import { prisma } from "../db/client.mjs";
import { CombinationsByTrackQuery } from "../schemas/combinations.schema.mjs";

/**
 * Get all subject combinations, optionally filtered by trackId or trackName.
 * Returns combinations with their subjects and school count.
 */
export async function getCombinationsHandler(filters: CombinationsByTrackQuery) {
  const { trackId, trackName, track, subjects, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (trackId) where.trackId = trackId;
  const requestedTrack = trackName ?? track;
  if (requestedTrack) where.track = { name: { equals: requestedTrack, mode: "insensitive" } };
  if (subjects.length > 0) {
    where.AND = subjects.map(subjectName => ({
      Subjects: { some: { name: subjectName } },
    }));
  }

  const [total, combinations] = await Promise.all([
    prisma.subjectCombination.count({ where }),
    prisma.subjectCombination.findMany({
      where,
      skip,
      take: limit,
      include: {
        track: { select: { id: true, name: true, pathway: true } },
        Subjects: { select: { name: true } },
        _count: { select: { Schools: true } },
        profile: {
          select: {
            difficultyLevel: true,
            careerPathways: true,
            overview: true,
          },
        },
      },
      orderBy: { code: "asc" },
    }),
  ]);

  return {
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: combinations,
  };
}
