import { Request, Response, NextFunction } from "express";
import { getSchoolCombinationsHandler } from "../handlers/school-combinations.handler.mjs";

export async function getSchoolCombinations(req: Request, res: Response, next: NextFunction) {
  try {
    const schoolId = req.params.schoolId as string;
    const data = await getSchoolCombinationsHandler(schoolId);

    if (!data) {
      res.status(404).json({ success: false, error: "School not found" });
      return;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    next(error);
  }
}
