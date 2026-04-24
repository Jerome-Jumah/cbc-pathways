import { Application } from 'express';
import { getSchoolsController, getCombinationsBySchoolController, getCombinationsBySubjectsController } from '../controllers/schools.mjs';

export const routes = (app: Application) => {
  app.get('/schools', getSchoolsController);
  app.get('/schools/:name/combinations', getCombinationsBySchoolController);
  app.get('/combinations/by-subjects', getCombinationsBySubjectsController);
};
