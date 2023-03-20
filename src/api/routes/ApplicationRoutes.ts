import { Application } from 'express';
import {
  changeApplicationStatus,
  createApplication,
  getApplicationsByTrip,
  payTrip,
} from '../controllers/ApplicationController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';
import { cancelApplication } from './../controllers/ApplicationController';

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
    .post(isAuthorized(), createApplication);

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
   *     parameters:
   *      - name: applicationId
   *        in: path
   *        required: true
   *        description: The id of the application
   *        schema:
   *          type: string
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                default: "DUE"
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
   * /api/v0/Trips/Applications/{applicationId}/Cancel:
   *   post:
   *     security:
   *        - bearerAuth: []
   *     summary: Cancel an accepted application.
   *     tags:
   *       - Applications
   *     description: Cancel an accepted application. Requires a token from an account to show it is authenticated and is trying to cancel its own application.
   *     parameters:
   *      - name: applicationId
   *        in: path
   *        required: true
   *        description: The id of the application
   *        schema:
   *          type: string
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              status:
   *                type: string
   *                default: "CANCELLED"
   *              description:
   *                type: string
   *                default: "Could not go"
   *     responses:
   *       200:
   *         description: Success
   */
  app
    .route('/api/v0/Trips/Applications/:applicationId/Cancel')
    .post(isAuthorized([Role.Explorer]), cancelApplication);

  /**
   * @swagger
   * /api/v0/Trips/Applications/{applicationId}/Pay:
   *   post:
   *     security:
   *        - bearerAuth: []
   *     summary: Pay for a trip.
   *     tags:
   *       - Applications
   *     description: Pay for a trip. Requires a token from an account to show it is authenticated and is trying to pay for its own application. Not implemented with the actual paypal payment as we were told this was not neccessary.
   *     parameters:
   *      - name: applicationId
   *        in: path
   *        required: true
   *        description: The id of the application
   *        schema:
   *          type: string
   *     responses:
   *       200:
   *         description: Success
   */
  app
    .route('/api/v0/Trips/Applications/:applicationId/Pay')
    .post(isAuthorized([Role.Explorer]), payTrip);
}
