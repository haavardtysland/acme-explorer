import { Application } from 'express';
import { login, useRefreshToken } from '../controllers/AuthController';

export function AuthRoutes(app: Application) {
  app.route('/api/v0/Actors/Login').post(login);
  app.route('/api/v0/refresh-token').post(useRefreshToken);
}
