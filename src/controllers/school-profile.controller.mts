import { NextFunction, Request, Response } from "express";
import { schoolProfileParamsSchema, schoolSlugParamsSchema, upsertSchoolProfileBodySchema } from "../schemas/school-profile.schema.mjs";
import { getSchoolProfileByIdHandler, getSchoolProfileBySlugHandler, upsertSchoolProfileHandler } from "../handlers/school-profile.handler.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

export async function getSchoolProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = schoolProfileParamsSchema.parse(req.params);

    const result = await getSchoolProfileByIdHandler(schoolId);

    if (!result) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getSchoolProfileBySlugController(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = schoolSlugParamsSchema.parse(req.params);

    const result = await getSchoolProfileBySlugHandler(slug);

    if (!result) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with slug '${slug}' not found.`);
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function upsertSchoolProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = schoolProfileParamsSchema.parse(req.params);
    const body = upsertSchoolProfileBodySchema.parse(req.body);

    const profile = await upsertSchoolProfileHandler({ schoolId, data: body });

    if (!profile) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `School with id '${schoolId}' not found.`);
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
