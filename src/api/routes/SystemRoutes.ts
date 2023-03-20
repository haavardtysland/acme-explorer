import { Application } from 'express';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function SystemRoutes(app: Application) {
  app
    .route('/api/v0/System')
    .post(isAuthorized([Role.Administrator]) /* postSystemSettings */);
}
