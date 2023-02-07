import { Application } from 'express';
import { login, useRefreshToken } from '../controllers/AuthController';

export function AuthRoutes(app: Application) {
  /**
   * @swagger
   * /api/v0/Actors/Login:
   *   post:
   *     summary: Login with a email and password.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - username
   *              - password
   *            properties:
   *              email:
   *                type: string
   *                default: ola.nordmann@gmail.com
   *              password:
   *                type: string
   *                default: 12345678
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  token:
   *                    type: string
   *       401:
   *         description: Could not find user with that email.
   *
   */
  app.route('/api/v0/Actors/Login').post(login);

  /**
   * @swagger
   * /api/v0/refresh-token:
   *   post:
   *     summary: Get refresh token if token is not valid anymore.
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *           application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  token:
   *                    type: string
   *
   */
  app.route('/api/v0/refresh-token').post(useRefreshToken);
}
