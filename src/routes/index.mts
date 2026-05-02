import { Router } from "express";
import { getCombinationProfileController } from "../controllers/combination-profile.controller.mjs";
import { getRecommendations } from "../controllers/recommendation.mjs";
import { getSchoolProfileController, upsertSchoolProfileController } from "../controllers/school-profile.controller.mjs";
import { getCombinationsBySchool, getCombinationsBySubjects, getSchools } from "../controllers/schools.mjs";
import { getAllTrackProfiles, getTrackProfileById } from "../controllers/track-profiles.mjs";
import { runValidation } from "../controllers/validation.mjs";
import {
  createSchoolEnrichmentJobController,
  listSchoolEnrichmentJobsController,
  queueMissingProfilesController,
  addSchoolSourceCandidateController,
  listSchoolSourceCandidatesController,
} from "../controllers/school-enrichment.controller.mjs";

const routes = Router();
routes.get("/schools", getSchools);
routes.get("/schools/:name/combinations", getCombinationsBySchool);
routes.get("/combinations/by-subjects", getCombinationsBySubjects);
routes.get("/debug/validation", runValidation);
routes.post("/recommendations", getRecommendations);

// Track Profiles
routes.get("/track-profiles", getAllTrackProfiles);
routes.get("/track-profiles/:trackId", getTrackProfileById);

// Combination Profiles (lazy generate + cache)
routes.get("/combinations/:combinationId/profile", getCombinationProfileController);

// School Profiles (manual enrichment, no AI)
routes.get("/schools/:schoolId/profile", getSchoolProfileController);
routes.put("/schools/:schoolId/profile", upsertSchoolProfileController);

// School Enrichment Queue
routes.post("/schools/:schoolId/enrichment-job", createSchoolEnrichmentJobController);
routes.get("/school-enrichment/jobs", listSchoolEnrichmentJobsController);
routes.post("/school-enrichment/queue-missing", queueMissingProfilesController);

// School Source Candidates
routes.post("/schools/:schoolId/source-candidates", addSchoolSourceCandidateController);
routes.get("/schools/:schoolId/source-candidates", listSchoolSourceCandidatesController);

export { routes };

