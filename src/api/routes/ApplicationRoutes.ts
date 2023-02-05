import { Application } from 'express';
import {
  createApplication,
  getApplicationsByActor,
  getApplicationsByTrip,
} from '../controllers/ApplicationController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ApplicationRoutes(app: Application) {
  app.route('/api/v0/Trips/:tripId/Applications').get(getApplicationsByTrip);

  app
    .route('/api/v0/Trips/Applications')
    .post(isAuthorized([Role.Manager]), createApplication);
  app.route('/api/v0/Actors/:actorId/Applications').get(getApplicationsByActor);
}
/*     .get(getApplication);
 */
/* app
    .route('/api/v0/Trips/:tripId')
    .get(getAppli)
    .put(isAuthorized([Role.Manager]), updateTrip)
    .delete(isAuthorized([Role.Manager]), deleteTrip);
}
 */
