import { Application } from 'express';
import {
  createApplication,
  getApplicationsByTrip,
  changeApplicationStatus,
} from '../controllers/ApplicationController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ApplicationRoutes(app: Application) {
  app.route('/api/v0/Trips/:tripId/Applications').get(getApplicationsByTrip);

  app
    .route('/api/v0/Trips/Applications')
    .post(isAuthorized(), createApplication);

  app
    .route('/api/v0/Trips/Application/:applicationId/Status')
    .put(isAuthorized([Role.Manager]), changeApplicationStatus);
}
