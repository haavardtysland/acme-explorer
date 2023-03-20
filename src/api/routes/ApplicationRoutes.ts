import { Application } from 'express';
import {
  changeApplicationStatus,
  createApplication,
  getApplicationsByTrip,
  payTrip,
} from '../controllers/ApplicationController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ApplicationRoutes(app: Application) {
  app.route('/api/v0/Trips/:tripId/Applications').get(getApplicationsByTrip);

  /**
   * @swagger
   * /api/v0/Trips/Applications:
   *   post:
   *     security:
   *        - bearerAuth: []
   *     summary: Create a new application.
   *     tags:
   *       - Applications
   *     description: Create a new application. Requires a token from an account to show it is authenticated.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              actorId:
   *                type: string
   *                default:
   *              tripId:
   *                type: string
   *                default:
   *              comments:
   *                type: array
   *                items:
   *                  type: string
   *                  default:
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app
    .route('/api/v0/Trips/Applications')
    .post(isAuthorized([Role.Explorer]), createApplication);

  /**
   * @swagger
   * /api/v0/Trips/Application/{applicationId}/Status:
   *   put:
   *     security:
   *        - bearerAuth: []
   *     summary: Change status of an application application.
   *     tags:
   *       - Applications
   *     description: Change status of an application application. Requires a token from a manager.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                default: "ACCEPTED"
   *              description:
   *                type: string
   *                default:
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app
    .route('/api/v0/Trips/Application/:applicationId/Status')
    .put(isAuthorized([Role.Manager]), changeApplicationStatus);

  /**
   * @swagger
   * /api/v0/Trips/Applications/:applicationId/Pay:
   *   post:
   *     security:
   *        - bearerAuth: []
   *     summary: Create a new application.
   *     tags:
   *       - Applications
   *     description: Pay for a trip. Requires a token from an account to show it is authenticated. Not implemented as it can be done through frontend.
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app.route('/api/v0/Trips/Applications/:applicationId/Pay').post(payTrip);
}
