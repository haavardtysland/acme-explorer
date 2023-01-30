import { Application } from 'express';
import {
  createActor,
  login,
  getActors,
  getActor,
  upadateActor,
  deleteActor,
} from '../controllers/ActorController';

export function ActorRoutes(app: Application) {
  app.route('/api/v0/Actor/Login').post(login);

  app.route('/api/v0/Actors').post(createActor).get(getActors);

  app
    .route('/api/v0/Actor/:actorId')
    .get(getActor)
    .put(upadateActor)
    .delete(deleteActor);
}
