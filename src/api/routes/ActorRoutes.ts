import { Application } from 'express';
import {
  createActor,
  deleteActor,
  getActor,
  getActors,
  upadateActor,
} from '../controllers/ActorController';

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
   *              - surename
   *            properties:
   *              name:
   *                type: string
   *                default: Ola
   *              surename:
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
   *     responses:
   *       201:
   *         description: Created
   */
  app.route('/api/v0/Actor').post(createActor);

  app
    .route('/api/v0/Actor/:actorId')
    .get(getActor)
    .put(upadateActor)
    .delete(deleteActor);
}
