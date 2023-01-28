import { Express } from 'express';
import { getActors } from '../controllers/ActorController';

export function ActorRoutes(app: Express) {
  app.route('/api/v0/Actor').get(getActors);
}
