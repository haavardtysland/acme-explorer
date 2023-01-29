import { Application } from 'express';
import { createActor, login, getActors } from '../controllers/ActorController';

export function ActorRoutes(app: Application) {
  app.route('/api/v0/Actor/Login').post(login);

  app.route('/api/v0/Actor').post(createActor).get(getActors);
}
