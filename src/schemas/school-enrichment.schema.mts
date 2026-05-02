import { z } from "zod";

export const ENRICHMENT_STATUSES = ["pending", "processing", "completed", "failed", "skipped"] as const;
export type EnrichmentStatus = (typeof ENRICHMENT_STATUSES)[number];

export const createSchoolEnrichmentJobParamsSchema = z.object({
  schoolId: z.string().min(32),
});

export const createSchoolEnrichmentJobBodySchema = z.object({
  priority: z.number().int().min(1).max(10).optional(),
});

export const listSchoolEnrichmentJobsQuerySchema = z.object({
  status: z.enum(ENRICHMENT_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const queueMissingProfilesBodySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
  priority: z.number().int().min(1).max(10).default(5),
});

export const addSchoolSourceCandidateBodySchema = z.object({
  url: z.url(),
  title: z.string().optional(),
  snippet: z.string().optional(),
  sourceType: z
    .enum(["official_website", "government_source", "school_document", "search_result", "other"])
    .optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
});

export type CreateEnrichmentJobBody = z.infer<typeof createSchoolEnrichmentJobBodySchema>;
export type ListEnrichmentJobsQuery = z.infer<typeof listSchoolEnrichmentJobsQuerySchema>;
export type QueueMissingProfilesBody = z.infer<typeof queueMissingProfilesBodySchema>;
export type AddSourceCandidateBody = z.infer<typeof addSchoolSourceCandidateBodySchema>;
