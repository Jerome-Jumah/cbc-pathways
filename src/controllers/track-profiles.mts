import { Request, Response, NextFunction } from "express";
import { getAllTrackProfilesHandler, getTrackProfileByIdHandler } from "../handlers/track-profiles.mjs";
import { trackProfileParamsSchema } from "../schemas/track-profile.schema.mjs";
import { httpErrorHandler, STATUS_CODES } from "../constants/index.mjs";

export async function getAllTrackProfiles(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getAllTrackProfilesHandler();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getTrackProfileById(req: Request, res: Response, next: NextFunction) {
  try {
    const { trackId } = trackProfileParamsSchema.parse(req.params);
    const track = await getTrackProfileByIdHandler(trackId);

    if (!track) {
      httpErrorHandler(STATUS_CODES.NOT_FOUND, `Track with id '${trackId}' not found.`);
      return;
    }

    res.json({ success: true, data: track });
  } catch (error) {
    next(error);
  }
}
