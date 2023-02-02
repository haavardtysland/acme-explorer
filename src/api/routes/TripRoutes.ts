import { Application } from 'express';
import {
  createTrip,
  getTrips,
  getTrip,
  upadateTrip,
  deleteTrip,
} from '../controllers/TripController';

export function TripRoutes(app: Application) {
  app.route('/api/v0/Trips').post(createTrip).get(getTrips);

  app
    .route('/api/v0/Trip/:tripId')
    .get(getTrip)
    .put(upadateTrip)
    .delete(deleteTrip);
}
