import { z } from "zod";

export const combinationsByTrackQuerySchema = z.object({
  trackId: z.string().optional(),
  trackName: z.string().optional(),
  track: z.string().optional(),
  subjects: z
    .string()
    .optional()
    .transform(val => (val ? val.split(",").map(s => s.trim().toUpperCase()) : [])),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CombinationsByTrackQuery = z.infer<typeof combinationsByTrackQuerySchema>;
