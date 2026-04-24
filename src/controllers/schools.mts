import { Request, Response, NextFunction } from 'express';
import { getSchoolsHandler, getCombinationsBySchoolHandler, getCombinationsBySubjectsHandler } from '../handlers/schools.mjs';
import { getSchoolsQuerySchema, getCombinationsBySchoolParamsSchema, getCombinationsBySubjectsQuerySchema } from '../schemas/api.mjs';

export const getSchoolsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = getSchoolsQuerySchema.parse(req.query);
    const { track, county, gender, subjects } = validated;
    const parsedSubjects = subjects ? (subjects as string).split(',') : undefined;
    
    const data = await getSchoolsHandler({
      track: track as string,
      county: county as string,
      gender: gender as string,
      subjects: parsedSubjects,
    });
    res.json({ success: true, data });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation Error', issues: error.errors });
      return;
    }
    next(error);
  }
};

export const getCombinationsBySchoolController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = getCombinationsBySchoolParamsSchema.parse(req.params);
    const data = await getCombinationsBySchoolHandler(validated.name);
    res.json({ success: true, data });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation Error', issues: error.errors });
      return;
    }
    next(error);
  }
};

export const getCombinationsBySubjectsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = getCombinationsBySubjectsQuerySchema.parse(req.query);
    const parsedSubjects = validated.subjects.split(',');
    const data = await getCombinationsBySubjectsHandler(parsedSubjects);
    res.json({ success: true, data });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ success: false, error: 'Validation Error', issues: error.errors });
      return;
    }
    next(error);
  }
};
