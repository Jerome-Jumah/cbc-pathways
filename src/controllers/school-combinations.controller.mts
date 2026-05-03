import { Request, Response, NextFunction } from "express";
import { getSchoolCombinationsHandler } from "../handlers/school-combinations.handler.mjs";
import { schoolProfileParamsSchema } from "../schemas/school-profile.schema.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

export async function getSchoolCombinations(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = schoolProfileParamsSchema.parse(req.params);
    const data = await getSchoolCombinationsHandler(schoolId);

    if (!data) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}
