import { Application } from 'express';
import multer from 'multer';
import {
  cancelTrip,
  createTrip,
  deleteTrip,
  getAppliedTrips,
  getSearchedTrips,
  getTrip,
  getTrips,
  getTripsByManager,
  updateTrip,
} from '../controllers/TripController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function TripRoutes(app: Application) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'pictures');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now());
    },
  });

  const upload = multer({ storage: storage });
  /**
   * @swagger
   * /api/v0/Trips:
   *   get:
   *    summary: Get all trips.
   *    tags:
   *      - Trips
   *    description: Get all trips that have been created in an array.
   *    responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  ticker:
   *                    type: string
   *                  title:
   *                    type: string
   *                  description:
   *                    type: string
   *                  totalPrice:
   *                    type: number
   *                  startDate:
   *                    type: date
   *                  endDate:
   *                    type: date
   *                  status:
   *                    type: object
   *                    properties:
   *                      status:
   *                        type: string
   *                      description:
   *                        type: string
   *                  stages:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        title:
   *                          type: string
   *                        description:
   *                          type: string
   *                        price:
   *                          type: number
   *                  pictures:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        name:
   *                          type: string
   *                        fileId:
   *                          type: string
   *                  requirements:
   *                    type: array
   *                    items:
   *                      type: string
   *                  isPublished:
   *                    type: boolean
   *                  applications:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        _id:
   *                          type: string
   *                        dateCreated:
   *                          type: date
   *                        status:
   *                          type: object
   *                          properties:
   *                            status:
   *                              type: string
   *                            description:
   *                              type: string
   *                        comments:
   *                          type: array
   *                          items:
   *                            type: string
   *                        actorId:
   *                          type: string
   *                        tripId:
   *                          type: string
   *       400:
   *         description: Bad request
   *   post:
   *    security:
   *       - bearerAuth: []
   *    summary: Post new trip
   *    tags:
   *      - Trips
   *    description: Post new trip to the array of trips
   *    requestBody:
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           required:
   *             - title
   *             - description
   *             - startDate
   *             - endDate
   *             - stages
   *             - requirements
   *           properties:
   *             title:
   *               type: string
   *               default: Ibiza
   *             description:
   *               type: string
   *               default: This is a long trip
   *             startDate:
   *               type: date
   *               default: 2023-10-10
   *             endDate:
   *               type: date
   *               default: 2023-11-11
   *             stages:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   title:
   *                     type: string
   *                     default: Walking the streets
   *                   description:
   *                     type: string
   *                     default: A guide will be following the group around the city
   *                   price:
   *                     type: number
   *                     default: 99
   *             pictures:
   *               type: array
   *               items:
   *             requirements:
   *               type: array
   *               items:
   *                 type: string
   *                 default: waterbottle
   *    responses:
   *      200:
   *        description: Successful
   *      400:
   *        description: Bad Request
   *      422:
   *        description: Unprocessable Entity
   *      403:
   *        description: Forbidden
   *
   */
  app
    .route('/api/v0/Trips')
    .post(isAuthorized([Role.Manager]), upload.array('pictures'), createTrip)
    .get(getTrips);

  /**
   * @swagger
   * /api/v0/Trips/{tripId}:
   *
   *   put:
   *    security:
   *       - bearerAuth: []
   *    summary: Update a trip.
   *    tags:
   *      - Trips
   *    description: Update a trip to edit the trip values. Requires token to verify that the mangager who wishes to update the trip is allowed to do so.
   *    parameters:
   *      - name: tripId
   *        in: path
   *        required: true
   *        description: The id of the trip
   *        schema:
   *          type: string
   *    requestBody:
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           required:
   *             - title
   *             - description
   *             - startDate
   *             - endDate
   *             - stages
   *             - requirements
   *           properties:
   *             title:
   *               type: string
   *               default: Ibiza
   *             description:
   *               type: string
   *               default: This is a long trip
   *             startDate:
   *               type: date
   *               default: 2023-10-10
   *             endDate:
   *               type: date
   *               default: 2023-11-11
   *             stages:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   title:
   *                     type: string
   *                     default: Walking the streets
   *                   description:
   *                     type: string
   *                     default: A guide will be following the group around the city
   *                   price:
   *                     type: number
   *                     default: 99
   *             pictures:
   *               type: array
   *               items:
   *             requirements:
   *               type: array
   *               items:
   *                 type: string
   *                 default: waterbottle
   *    responses:
   *      200:
   *        description: Successful

   *   delete:
   *    security:
   *       - bearerAuth: []
   *    summary: Delete a Trip. It cannot be published.
   *    tags:
   *      - Trips
   *    description: Delete an Trip with tripId. Requires a token to verify that the manager who wishes to delete the trip is allowed to do so.
   *    parameters:
   *      - name: tripId
   *        in: path
   *        required: true
   *        description: The id of the trip
   *        schema:
   *          type: string
   *    responses:
   *      default:
   *        description: successfully cancelled trip
   *   get:
   *    summary: Get trip by id.
   *    tags:
   *      - Trips
   *    description: Get trip with trip id
   *    parameters:
   *      - name: tripId
   *        in: path
   *        required: true
   *        description: The id of the trip
   *        schema:
   *          type: string
   *
   *    responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  ticker:
   *                    type: string
   *                  title:
   *                    type: string
   *                  description:
   *                    type: string
   *                  totalPrice:
   *                    type: number
   *                  startDate:
   *                    type: date
   *                  endDate:
   *                    type: date
   *                  status:
   *                    type: object
   *                    properties:
   *                      status:
   *                        type: string
   *                      description:
   *                        type: string
   *                  stages:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        title:
   *                          type: string
   *                        description:
   *                          type: string
   *                        price:
   *                          type: number
   *                  pictures:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        name:
   *                          type: string
   *                        fileId:
   *                          type: string
   *                  requirements:
   *                    type: array
   *                    items:
   *                      type: string
   *                  isPublished:
   *                    type: boolean
   *                  applications:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        _id:
   *                          type: string
   *                        dateCreated:
   *                          type: date
   *                        status:
   *                          type: object
   *                          properties:
   *                            status:
   *                              type: string
   *                            description:
   *                              type: string
   *                        comments:
   *                          type: array
   *                          items:
   *                            type: string
   *                        actorId:
   *                          type: string
   *                        tripId:
   *                          type: string
   *       400:
   *         description: Bad request
   */
  app
    .route('/api/v0/Trips/:tripId')
    .get(getTrip)
    .put(isAuthorized([Role.Manager]), updateTrip)
    .delete(isAuthorized([Role.Manager]), deleteTrip);

  /**
   * @swagger
   * /api/v0/Trips/{tripId}/Status:
   *   put:
   *    security:
   *      - bearerAuth: []
   *    summary: Cancel a trip that is already published.
   *    tags:
   *      - Trips
   *    description: Cancel a trip that has been published, but not started yet. Can only be cancelled if no applications have been accepted yet and a manager token is presented.
   *    parameters:
   *      - name: tripId
   *        in: path
   *        required: true
   *        description: The id of the trip
   *        schema:
   *          type: string
   *
   *    responses:
   *      default:
   *        description: successfully cancelled trip
   *
   */
  app
    .route('api/v0/Trips/:tripId/Status')
    .put(isAuthorized([Role.Manager]), cancelTrip);

  app.route('/api/v0/Actors/:actorId/Trips').get(getAppliedTrips);

  app
    .route('/api/v0/Managers/:managerId/Trips')
    .get(isAuthorized([Role.Manager]), getTripsByManager);

  /**
   * @swagger
   * /api/v0/Trips/Search/{searchWord}:
   *   get:
   *    summary: Get all trips that contain searchword.
   *    tags:
   *      - Trips
   *    description: Get all trips that have been have a match in either ticker, title or description .
   *    parameters:
   *      - name: searchword
   *        in: path
   *        required: true
   *        description: The word you want to search for
   *        schema:
   *          type: string
   *    responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                type: object
   *                properties:
   *                  _id:
   *                    type: string
   *                  ticker:
   *                    type: string
   *                  title:
   *                    type: string
   *                  description:
   *                    type: string
   *                  totalPrice:
   *                    type: number
   *                  startDate:
   *                    type: date
   *                  endDate:
   *                    type: date
   *                  status:
   *                    type: object
   *                    properties:
   *                      status:
   *                        type: string
   *                      description:
   *                        type: string
   *                  stages:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        title:
   *                          type: string
   *                        description:
   *                          type: string
   *                        price:
   *                          type: number
   *                  pictures:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        name:
   *                          type: string
   *                        fileId:
   *                          type: string
   *                  requirements:
   *                    type: array
   *                    items:
   *                      type: string
   *                  isPublished:
   *                    type: boolean
   *                  applications:
   *                    type: array
   *                    items:
   *                      type: object
   *                      properties:
   *                        _id:
   *                          type: string
   *                        dateCreated:
   *                          type: date
   *                        status:
   *                          type: object
   *                          properties:
   *                            status:
   *                              type: string
   *                            description:
   *                              type: string
   *                        comments:
   *                          type: array
   *                          items:
   *                            type: string
   *                        actorId:
   *                          type: string
   *                        tripId:
   *                          type: string
   *       400:
   *         description: Bad request
   */
  app.route('/api/v0/Trips/Search/:searchWord').get(getSearchedTrips);
}
