import { z } from "zod";

export const combinationProfileParamsSchema = z.object({
  combinationId: z.uuid(),
});

export const combinationProfileQuerySchema = z.object({
  generate: z
    .string()
    .optional()
    .transform(v => v === "true"),
});

export const generatedCombinationProfileSchema = z.object({
  overview: z.string().min(30),
  bestFor: z.string().min(10),
  difficultyLevel: z.enum(["Low", "Medium", "High"]),
  careerPathways: z.array(
    z.object({
      title: z.string(),
      compatibility: z.enum(["Low", "Medium", "High"]),
    }),
  ),
  keyBenefits: z.array(z.string()),
  subjectDetails: z.array(
    z.object({
      subject: z.string(),
      role: z.string(),
      importance: z.enum(["Core", "Supporting", "Specialized"]),
    }),
  ),
});

export type GeneratedCombinationProfile = z.infer<typeof generatedCombinationProfileSchema>;
