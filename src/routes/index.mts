import { Router } from "express";
import { getCombinationsBySchoolController, getCombinationsBySubjectsController, getSchoolsController } from "../controllers/schools.mjs";

const routes = Router();
routes.get("/schools", getSchoolsController);
routes.get("/schools/:name/combinations", getCombinationsBySchoolController);
routes.get("/combinations/by-subjects", getCombinationsBySubjectsController);

export { routes };
