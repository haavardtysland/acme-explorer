import { Application } from 'express';
import {
  createActor,
  deleteActor,
  getActor,
  getActors,
  updateActor,
  changeBannedStatus,
} from '../controllers/ActorController';
import { isAuthorized, verifyIdentity } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';
import { createManager } from './../controllers/ActorController';

export function ActorRoutes(app: Application) {
  /**
   * @swagger
   *  /api/v0/Actors:
   *    get:
   *      security:
   *        - bearerAuth: []
   *      summary: Get all actors
   *      description: Retrieve a array of all actors. Need a token from an administrator account to be able to do this.
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
   *                    type: string
   *                  name:
   *                    type: string
   *                  surname:
   *                    type: string
   *                  email:
   *                    type: string
   *                  role:
   *                    type: string
   *                  password:
   *                    type: string
   *                  __v:
   *                    type: number
   *       400:
   *         description: Bad request
   */
  app
    .route('/api/v0/Actors')
    .get(isAuthorized([Role.Administrator]), getActors);

  /**
   * @swagger
   * /api/v0/Actors:
   *   post:
   *     summary: Create an Actor.
   *     description: Create a new actor which will be set with the role Explorer.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - name
   *              - surname
   *              - email
   *              - password
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
   *
   *     responses:
   *       200:
   *         description: Success
   *       422:
   *         description: Unprocessable Entity
   *       400:
   *         description: Bad Request
   *
   */
  app.route('/api/v0/Actors').post(createActor);

  /**
   * @swagger
   * /api/v0/Manager:
   *   post:
   *     security:
   *        - bearerAuth: []
   *     summary: Create a manager account.
   *     description: Create a manager account. Requires a token from an account with the role Adminstrator.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - name
   *              - surname
   *              - email
   *              - password
   *            properties:
   *              name:
   *                type: string
   *                default: Man
   *              surname:
   *                type: string
   *                default: Ager
   *              email:
   *                type: string
   *                default: manager@gmail.com
   *              password:
   *                 type: string
   *                 default: 12345678
   *     responses:
   *       200:
   *         description: Success
   *
   */
  app
    .route('/api/v0/Manager')
    .post(isAuthorized([Role.Administrator]), createManager);

  /**
   * @swagger
   * /api/v0/Actors/{actorId}:
   *   put:
   *    security:
   *       - bearerAuth: []
   *    summary: Update an actor.
   *    description: Update the information for an actor. Requires a token to verify that the actor who wishes to update the information is allowed to do so.
   *    parameters:
   *      - name: actorId
   *        in: path
   *        required: true
   *        description: The id of the actor
   *        schema:
   *          type: string
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
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
   *                type: string
   *                default: 12345678
   *    responses:
   *      default:
   *        description: successfully updated actor
   *   get:
   *    security:
   *       - bearerAuth: []
   *    summary: Get all actors
   *    description: Retrieve a an actor based on their actorId. Can only be done by a manager.
   *    responses:
   *      200:
   *        description: Success
   *        content:
   *         application/json:
   *           schema:
   *             type: array
   *             items:
   *               type: object
   *               properties:
   *                  id:
   *                    type: string
   *                  name:
   *                    type: string
   *                  surname:
   *                    type: string
   *                  email:
   *                    type: string
   *                  role:
   *                    type: string
   *                  password:
   *                    type: string
   *                  __v:
   *                    type: number
   *      400:
   *        description: Bad request
   *   delete:
   *    security:
   *       - bearerAuth: []
   *    summary: Delete an actor.
   *    description: Delete an actor. Requires a token to verify that the actor who wishes to delete the actor is allowed to do so.
   *    parameters:
   *      - name: actorId
   *        in: path
   *        required: true
   *        description: The id of the actor
   *        schema:
   *          type: string
   */
  app
    .route('/api/v0/Actors/:actorId')
    .get(isAuthorized([Role.Administrator]), getActor)
    .put(verifyIdentity, updateActor)
    .delete(verifyIdentity, deleteActor);

  app
    .route('/api/v0/Actors/:actorId/Banned')
    .put(isAuthorized([Role.Administrator]), changeBannedStatus);
}
