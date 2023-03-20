import { Application } from 'express';
import { postSystemSettings } from '../controllers/SystemSettingsController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function SystemSettingsRoutes(app: Application) {
  /**
   * @swagger
   * /api/v0/SystemSettings:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     summary: Change system settings for caching time and finder result limit.
   *     tags:
   *       - System Settings
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *               false
   *            properties:
   *              cachingTime:
   *                type: number
   *                default: 3600
   *              resultLimit:
   *                type: number
   *                default: 10
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app
    .route('/api/v0/SystemSettings')
    .post(isAuthorized([Role.Administrator]), postSystemSettings);
}
