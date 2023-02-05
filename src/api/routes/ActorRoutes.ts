import { createManager } from './../controllers/ActorController';
import { Application } from 'express';
import {
  createActor,
  deleteActor,
  getActor,
  getActors,
  updateActor,
} from '../controllers/ActorController';
import { isAuthorized, verifyIdentity } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function ActorRoutes(app: Application) {
  /**
   * @swagger
   *  /api/v0/Actor:
   *    get:
   *      summary: Get all actors
   *      description: Retrieve a array of all actors
   *      responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  id:
   *                    type: number
   *                  name:
   *                    type: string
   *       400:
   *         description: Bad request
   */
  app.route('/api/v0/Actor').get(getActors);

  /**
   * @swagger
   * /api/v0/Actor:
   *   post:
   *     summary: Create an Actor.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - name
   *              - surname
   *            properties:
   *              name:
   *                type: string
   *                default: Ola
   *              surname:
   *                type: string
   *                default: Nordmann
   *              email:
   *                type: string
   *                default: ola.nordmann@gmail.com
   *              password:
   *                 type: string
   *                 default: 12345678
   *              role:
   *                 type: string
   *                 default: EXPLORER
   */
  app.route('/api/v0/Actor').post(createActor);

  app.route('/api/v0/Manager').post(isAuthorized([Role.Administrator]), createManager);

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
