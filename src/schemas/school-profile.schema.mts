import { z } from "zod";

export const schoolProfileParamsSchema = z.object({
  schoolId: z.string().min(32),
});

export const upsertSchoolProfileBodySchema = z.object({
  motto: z.string().optional(),
  establishedYear: z
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  principalName: z.string().optional(),
  phone: z.string().optional(),
  email: z.email().optional(),
  website: z.url().optional(),
  description: z.string().optional(),
  locationText: z.string().optional(),
  studentPopulation: z.number().int().positive().optional(),
  highlights: z.array(z.string()).optional(),
  sourceUrl: z.url().optional(),
  sourceType: z
    .enum([
      "official_website",
      "government_source",
      "school_document",
      "manual_entry",
      "other",
    ])
    .optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
});

export type UpsertSchoolProfileInput = z.infer<typeof upsertSchoolProfileBodySchema>;
