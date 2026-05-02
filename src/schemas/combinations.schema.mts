import { z } from "zod";

export const combinationsByTrackQuerySchema = z.object({
  trackId: z.string().optional(),
  trackName: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(200).default(100),
});

export type CombinationsByTrackQuery = z.infer<typeof combinationsByTrackQuerySchema>;
