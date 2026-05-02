import { NextFunction, Request, Response } from "express";
import { combinationProfileParamsSchema, combinationProfileQuerySchema } from "../schemas/combination-profile.schema.mjs";
import { getCombinationProfileHandler } from "../handlers/combination-profile.handler.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

export async function getCombinationProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const { combinationId } = combinationProfileParamsSchema.parse(req.params);
    const { generate } = combinationProfileQuerySchema.parse(req.query);

    const result = await getCombinationProfileHandler({ combinationId, generate });

    if (!result.found) {
      if (!result.combinationExists) {
        httpErrorHandler(STATUS_CODES.NOT_FOUND, `Combination with id '${combinationId}' not found.`);
        return;
      }
      // combinationExists but no profile and generate !== true
      httpErrorHandler(
        STATUS_CODES.NOT_FOUND,
        `No profile found for combination '${combinationId}'. Add ?generate=true to generate one.`,
      );
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
