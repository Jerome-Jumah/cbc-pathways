import { prisma } from "../db/client.mjs";
import { generateCombinationProfile } from "../services/combination-profile-generator.mjs";
import logger from "../constants/logger.mjs";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GetCombinationProfileInput {
  combinationId: string;
  generate?: boolean;
}

// ─── Helper: fetch combination with all relations ─────────────────────────────

async function fetchCombinationWithRelations(combinationId: string) {
  return prisma.subjectCombination.findUnique({
    where: { id: combinationId },
    include: {
      Subjects: { select: { name: true } },
      track: { select: { name: true, pathway: true } },
      profile: true,
      _count: { select: { Schools: true } },
    },
  });
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function getCombinationProfileHandler(input: GetCombinationProfileInput) {
  const { combinationId, generate = false } = input;

  const combination = await fetchCombinationWithRelations(combinationId);

  if (!combination) {
    return { found: false, combinationExists: false } as const;
  }

  // Cache hit — return stored profile
  if (combination.profile) {
    return {
      found: true,
      generated: false,
      combination: {
        id: combination.id,
        code: combination.code,
        subjects: combination.Subjects.map(s => s.name),
        track: combination.track.name,
        pathway: combination.track.pathway,
        schoolCount: combination._count.Schools,
      },
      profile: combination.profile,
    } as const;
  }

  // Profile missing and generation not requested
  if (!generate) {
    return { found: false, combinationExists: true } as const;
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  logger.info(`Generating CombinationProfile for ${combinationId}`);

  const { profile: generatedData, generatedBy, promptVersion } = await generateCombinationProfile({
    subjects: combination.Subjects.map(s => s.name),
    trackName: combination.track.name,
    pathway: combination.track.pathway,
    schoolCount: combination._count.Schools,
  });

  // Save — upsert guards against a rare race condition where two requests hit simultaneously
  const savedProfile = await prisma.combinationProfile.upsert({
    where: { combinationId },
    create: {
      combinationId,
      overview: generatedData.overview,
      bestFor: generatedData.bestFor,
      difficultyLevel: generatedData.difficultyLevel,
      careerPathways: generatedData.careerPathways,
      keyBenefits: generatedData.keyBenefits,
      subjectDetails: generatedData.subjectDetails,
      generatedBy,
      promptVersion,
    },
    update: {
      overview: generatedData.overview,
      bestFor: generatedData.bestFor,
      difficultyLevel: generatedData.difficultyLevel,
      careerPathways: generatedData.careerPathways,
      keyBenefits: generatedData.keyBenefits,
      subjectDetails: generatedData.subjectDetails,
      generatedBy,
      promptVersion,
    },
  });

  logger.info(`CombinationProfile saved for ${combinationId} (by: ${generatedBy})`);

  return {
    found: true,
    generated: true,
    combination: {
      id: combination.id,
      code: combination.code,
      subjects: combination.Subjects.map(s => s.name),
      track: combination.track.name,
      pathway: combination.track.pathway,
      schoolCount: combination._count.Schools,
    },
    profile: savedProfile,
  } as const;
}
