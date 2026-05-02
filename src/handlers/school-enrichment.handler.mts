import { prisma } from "../db/client.mjs";
import { EnrichmentStatus } from "../schemas/school-enrichment.schema.mjs";
import { AddSourceCandidateBody } from "../schemas/school-enrichment.schema.mjs";

// ─── Create / Reset Enrichment Job ───────────────────────────────────────────

export async function createSchoolEnrichmentJobHandler(input: { schoolId: string; priority?: number }) {
  const { schoolId, priority = 5 } = input;

  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
  if (!school) return null;

  const existing = await prisma.schoolEnrichmentJob.findUnique({ where: { schoolId } });

  if (existing) {
    // Already completed → return as-is; do not auto-reset
    if (existing.status === "completed") return { job: existing, action: "unchanged" as const };

    // Failed → allow reset to pending so it can be retried
    if (existing.status === "failed") {
      const updated = await prisma.schoolEnrichmentJob.update({
        where: { schoolId },
        data: {
          status: "pending",
          priority,
          lastError: null,
          startedAt: null,
          completedAt: null,
          updatedAt: new Date(),
        },
      });
      return { job: updated, action: "reset" as const };
    }

    // pending / processing / skipped → update priority only
    const updated = await prisma.schoolEnrichmentJob.update({
      where: { schoolId },
      data: { priority, updatedAt: new Date() },
    });
    return { job: updated, action: "updated" as const };
  }

  // No job yet → create fresh
  const job = await prisma.schoolEnrichmentJob.create({
    data: { schoolId, priority, status: "pending" },
  });
  return { job, action: "created" as const };
}

// ─── List Enrichment Jobs ─────────────────────────────────────────────────────

export async function listSchoolEnrichmentJobsHandler(input: { status?: EnrichmentStatus; limit?: number }) {
  const { status, limit = 50 } = input;

  return prisma.schoolEnrichmentJob.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    take: limit,
    include: {
      school: { select: { name: true, county: true, cluster: true } },
    },
  });
}

// ─── Bulk Queue Missing Profiles ──────────────────────────────────────────────

export async function queueSchoolsMissingProfilesHandler(input: { limit?: number; priority?: number }) {
  const { limit = 100, priority = 5 } = input;

  // Schools with no SchoolProfile and no existing enrichment job
  const schools = await prisma.school.findMany({
    where: {
      profile: null,
      enrichmentJob: null,
    },
    select: { id: true },
    take: limit,
  });

  if (schools.length === 0) return { queued: 0 };

  const result = await prisma.schoolEnrichmentJob.createMany({
    data: schools.map(s => ({
      schoolId: s.id,
      status: "pending",
      priority,
    })),
    skipDuplicates: true,
  });

  return { queued: result.count };
}

// ─── Source Candidates ────────────────────────────────────────────────────────

export async function addSchoolSourceCandidateHandler(input: { schoolId: string } & AddSourceCandidateBody) {
  const { schoolId, url, title, snippet, sourceType, confidenceScore } = input;

  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
  if (!school) return null;

  // Upsert by (schoolId, url) — the composite unique index
  return prisma.schoolSourceCandidate.upsert({
    where: { schoolId_url: { schoolId, url } },
    create: { schoolId, url, title, snippet, sourceType, confidenceScore },
    update: { title, snippet, sourceType, confidenceScore, updatedAt: new Date() },
  });
}

export async function listSchoolSourceCandidatesHandler(schoolId: string) {
  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } });
  if (!school) return null;

  return prisma.schoolSourceCandidate.findMany({
    where: { schoolId },
    orderBy: [{ confidenceScore: "desc" }, { createdAt: "asc" }],
  });
}
