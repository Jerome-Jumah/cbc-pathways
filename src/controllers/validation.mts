import { NextFunction, Request, Response } from "express";
import { runDataValidationHandler } from "../handlers/data-validation.mjs";

export async function runValidationController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await runDataValidationHandler();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
