import { Application } from 'express';
import {
  cancelTrip,
  createTrip,
  deleteTrip,
  getSearchedTrips,
  getTrip,
  getTripByActor,
  getTrips,
  getTripsByManager,
  updateTrip,
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

  /**
   * @swagger
   * /api/v0/Trips/{tripId}/Status:
   *   put:
   *    summary: Cancel a trip that is already published.
   *    description: Cancel a trip that has been published, but not started yet. Can only be cancelled if no applications have been accepted yet.
   *    parameters:
   *      - name: tripId
   *        in: path
   *        required: true
   *        description: The id of the trip
   *        schema:
   *          type: string
   *
   *    responses:
   *      default:
   *        description: successful operation
   */
  app
    .route('api/v0/Trips/:tripId/Status')
    .put(isAuthorized([Role.Manager]), cancelTrip);

  app.route('/api/v0/Actors/:actorId/Trips').get(getTripByActor);
  app
    .route('/api/v0/Actors/:actorId/Trips')
    .get(verifyIdentity, getTripByActor);

  app
    .route('/api/v0/Managers/:managerId/Trips')
    .get(isAuthorized([Role.Manager]), getTripsByManager);

  app.route('/api/v0/Trips/Search/:searchWord').get(getSearchedTrips);
}
