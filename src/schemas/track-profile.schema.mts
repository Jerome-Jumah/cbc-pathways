import { z } from "zod";

export const trackProfileParamsSchema = z.object({
  trackId: z.uuid(),
});

export type TrackProfileParams = z.infer<typeof trackProfileParamsSchema>;
