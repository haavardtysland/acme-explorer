import { Application } from 'express';
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  getTripByActor,
  getTripsByManager,
  getSearchedTrips
} from '../controllers/TripController';
import { isAuthorized, verifyIdentity } from '../middlewares/AuthMiddleware';
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

  app
    .route('/api/v0/Actors/:actorId/Trips')
    .get(verifyIdentity, getTripByActor);

  app
    .route('/api/v0/Managers/:managerId/Trips')
    .get(isAuthorized([Role.Manager]), getTripsByManager);

  app.route('/api/v0/Trips/Search/:searchWord').get(getSearchedTrips);
}
