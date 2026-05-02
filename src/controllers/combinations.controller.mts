import { Request, Response, NextFunction } from "express";
import { getCombinationsHandler } from "../handlers/combinations.handler.mjs";
import { combinationsByTrackQuerySchema } from "../schemas/combinations.schema.mjs";

export async function getCombinations(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = combinationsByTrackQuerySchema.parse(req.query);
    const data = await getCombinationsHandler(validated);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}
