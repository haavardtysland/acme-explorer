import { Application } from 'express';
import {
  createActor,
  getActors,
  getActor,
  updateActor,
  deleteActor,
} from '../controllers/ActorController';
import { isAuthorized, verifyIdentity } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ActorRoutes(app: Application) {
  app
    .route('/api/v0/Actors')
    .post(createActor)
    .get(isAuthorized([Role.Administrator]), getActors);

  app
    .route('/api/v0/Actors/:actorId')
    .get(isAuthorized([Role.Administrator]), getActor)
    .put(verifyIdentity, updateActor)
    .delete(verifyIdentity, deleteActor);
}
