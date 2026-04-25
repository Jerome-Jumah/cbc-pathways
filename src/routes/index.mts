import { Router } from "express";
import { getCombinationsBySchoolController, getCombinationsBySubjectsController, getSchoolsController } from "../controllers/schools.mjs";
import { runValidationController } from "../controllers/validation.mjs";

const routes = Router();
routes.get("/schools", getSchoolsController);
routes.get("/schools/:name/combinations", getCombinationsBySchoolController);
routes.get("/combinations/by-subjects", getCombinationsBySubjectsController);
routes.get("/debug/validation", runValidationController);

export { routes };
