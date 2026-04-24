import { z } from 'zod';

export const getSchoolsQuerySchema = z.object({
  track: z.string().optional(),
  county: z.string().optional(),
  gender: z.string().optional(),
  subjects: z.string().optional(), // Expected as comma-separated string
});

export const getCombinationsBySchoolParamsSchema = z.object({
  name: z.string().min(1),
});

export const getCombinationsBySubjectsQuerySchema = z.object({
  subjects: z.string().min(1, "Subjects parameter is required (comma-separated)"),
});
