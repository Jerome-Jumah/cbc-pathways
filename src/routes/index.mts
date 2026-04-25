import { Router } from "express";
import { getCombinationsBySchool, getCombinationsBySubjects, getSchools } from "../controllers/schools.mjs";
import { runValidation } from "../controllers/validation.mjs";
import { getRecommendations } from "../controllers/recommendation.mjs";

const routes = Router();
routes.get("/schools", getSchools);
routes.get("/schools/:name/combinations", getCombinationsBySchool);
routes.get("/combinations/by-subjects", getCombinationsBySubjects);
routes.get("/debug/validation", runValidation);
routes.post("/recommendations", getRecommendations);

export { routes };
