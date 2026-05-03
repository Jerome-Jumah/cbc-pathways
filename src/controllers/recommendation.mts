import { NextFunction, Request, Response } from "express";

import { recommendationRequestSchema } from "../schemas/api.mjs";
import { generateRecommendationsHandler } from "../handlers/recommendation.mjs";

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = recommendationRequestSchema.parse(req.body);

    const recommendations = await generateRecommendationsHandler(parsedBody);

    return res.status(200).json({
      status: "success",
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
}
