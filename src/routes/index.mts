import { Router } from "express";
import { getCombinationsBySchool, getCombinationsBySubjects, getSchools } from "../controllers/schools.mjs";
import { runValidation } from "../controllers/validation.mjs";
import { getRecommendations } from "../controllers/recommendation.mjs";
import { getAllTrackProfiles, getTrackProfileById } from "../controllers/track-profiles.mjs";

const routes = Router();
routes.get("/schools", getSchools);
routes.get("/schools/:name/combinations", getCombinationsBySchool);
routes.get("/combinations/by-subjects", getCombinationsBySubjects);
routes.get("/debug/validation", runValidation);
routes.post("/recommendations", getRecommendations);

// Track Profiles
routes.get("/track-profiles", getAllTrackProfiles);
routes.get("/track-profiles/:trackId", getTrackProfileById);

export { routes };
