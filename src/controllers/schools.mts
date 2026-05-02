import { Request, Response, NextFunction } from "express";
import { getSchoolsHandler, getCombinationsBySchoolHandler, getCombinationsBySubjectsHandler } from "../handlers/schools.mjs";
import { getSchoolsQuerySchema, getCombinationsBySchoolParamsSchema, getCombinationsBySubjectsQuerySchema } from "../schemas/api.mjs";

export async function getSchools(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getSchoolsQuerySchema.parse(req.query);
    const { track, county, gender, accommodation, subjects, limit, page, category } = validated;

    const data = await getSchoolsHandler({ track, county, gender, accommodation, subjects, category, limit: +limit, page: +page });

    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getCombinationsBySchool(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getCombinationsBySchoolParamsSchema.parse(req.params);
    const data = await getCombinationsBySchoolHandler(validated.name);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}

export async function getCombinationsBySubjects(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getCombinationsBySubjectsQuerySchema.parse(req.query);
    const parsedSubjects = validated.subjects.split(",");
    const data = await getCombinationsBySubjectsHandler(parsedSubjects);
    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}
