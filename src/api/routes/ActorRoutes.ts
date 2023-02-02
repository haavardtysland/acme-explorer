import { Application } from 'express';
import {
  createActor,
  getActors,
  getActor,
  upadateActor,
  deleteActor,
} from '../controllers/ActorController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ActorRoutes(app: Application) {
  app.route('/api/v0/Actor').post(createActor).get(getActors);

  app
    .route('/api/v0/Actor/:actorId')
    .get(getActor)
    .put(upadateActor)
    .delete(deleteActor);
}
