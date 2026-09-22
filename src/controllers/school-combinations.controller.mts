import { Request, Response, NextFunction } from "express";
import { getSchoolCombinationsByIdHandler, getSchoolCombinationsBySlugHandler } from "../handlers/school-combinations.handler.mjs";
import { schoolProfileParamsSchema, schoolSlugParamsSchema } from "../schemas/school-profile.schema.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

export async function getSchoolCombinations(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = schoolProfileParamsSchema.parse(req.params);
    const data = await getSchoolCombinationsByIdHandler(schoolId);

    if (!data) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getSchoolCombinationsBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = schoolSlugParamsSchema.parse(req.params);

    const data = await getSchoolCombinationsBySlugHandler(slug);

    if (!data) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with slug '${slug}' not found.`);
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
