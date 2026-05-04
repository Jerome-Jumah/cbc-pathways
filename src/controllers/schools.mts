import { Request, Response, NextFunction } from "express";
import { getSchoolsHandler, getCombinationsBySchoolHandler, getCombinationsBySubjectsHandler } from "../handlers/schools.mjs";
import { getSchoolsQuerySchema, getCombinationsBySchoolParamsSchema, getCombinationsBySubjectsQuerySchema } from "../schemas/api.mjs";

export async function getSchools(req: Request, res: Response, next: NextFunction) {
  try {
    const validated = getSchoolsQuerySchema.parse(req.query);
    const { search, track, county, gender, accommodation, subjects, limit, page, category, cluster, preferredTrack, recommendedCombinationIds } = validated;

    const data = await getSchoolsHandler({
      search,
      track,
      county,
      gender,
      accommodation,
      subjects,
      category,
      cluster,
      preferredTrack,
      recommendedCombinationIds,
      limit: +limit,
      page: +page,
    });

    res.json({
      success: true,
      data,
      pagination: {
        page: data.meta.page,
        limit: data.meta.limit,
        total: data.meta.total,
        hasMore: data.meta.page < data.meta.totalPages,
      },
    });
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
