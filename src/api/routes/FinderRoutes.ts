import { Application } from 'express';
import { updateFinder } from '../controllers/FinderController';
import { findTrips } from '../controllers/FinderController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function FinderRoutes(app: Application) {
  //app.route('api/v0/Finder').put(updateFinder);

  app.route('/api/v0/Finder/Search').get(findTrips);
}
