import { Application } from 'express';
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getTripByActor,
} from '../controllers/TripController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function TripRoutes(app: Application) {
  app
    .route('/api/v0/Trips')
    .post(isAuthorized([Role.Manager]), createTrip)
    .get(getTrips);

  app
    .route('/api/v0/Trips/:tripId')
    .get(getTrip)
    .put(isAuthorized([Role.Manager]), updateTrip)
    .delete(isAuthorized([Role.Manager]), deleteTrip);

  app.route('/api/v0/Actors/:actorId/Trips').get(getTripByActor);
}
