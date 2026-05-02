import { prisma } from "../db/client.mjs";

/**
 * Returns all tracks including their profile (if seeded).
 */
export async function getAllTrackProfilesHandler() {
  return prisma.track.findMany({
    orderBy: { name: "asc" },
    include: {
      profile: {
        select: {
          shortDescription: true,
          description: true,
          highlights: true,
          careerPathways: true,
          recommendedFor: true,
        },
      },
    },
  });
}

/**
 * Returns one track with its profile, looked up by track id.
 */
export async function getTrackProfileByIdHandler(trackId: string) {
  return prisma.track.findUnique({
    where: { id: trackId },
    include: {
      profile: {
        select: {
          shortDescription: true,
          description: true,
          highlights: true,
          careerPathways: true,
          recommendedFor: true,
        },
      },
    },
  });
}
