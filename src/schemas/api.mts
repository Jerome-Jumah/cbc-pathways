import { z } from "zod";

export const getSchoolsQuerySchema = z.object({
  track: z.string().optional(),
  county: z.string().optional(),
  gender: z.string().optional(),
  category: z.string().optional(),
  // Expecting a comma-separated list of subjects from the query string
  subjects: z
    .string()
    .optional()
    .transform(val => (val ? val.split(",").map(s => s.trim().toUpperCase()) : [])),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export type GetSchoolsQuery = z.infer<typeof getSchoolsQuerySchema>;

export const getCombinationsBySchoolParamsSchema = z.object({
  name: z.string().min(1),
});

export const getCombinationsBySubjectsQuerySchema = z.object({
  subjects: z.string().min(1, "Subjects parameter is required (comma-separated)"),
});

export const recommendationRequestSchema = z
  .object({
    // The subjects the student is good at or interested in
    preferredSubjects: z.array(z.string().transform(s => s.toUpperCase())).min(1),
    // Optional filters to narrow down the schools
    preferredCounty: z.string().optional(),
    preferredCategory: z.string().optional(), // e.g., "National", "Extra County"
  })
  .strict();

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
