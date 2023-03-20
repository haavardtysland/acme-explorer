import { Application } from 'express';
import { findTrips, updateFinder } from '../controllers/FinderController';
import { isAuthorized } from '../middlewares/AuthMiddleware';
import { Role } from '../models/Actor';

export function FinderRoutes(app: Application) {
  /**
   * @swagger
   * /api/v0/Finder:
   *   put:
   *    security:
   *       - bearerAuth: []
   *    summary: Update an actors finder.
   *    tags:
   *      - Finder
   *    description: Update an actors finder. Actor needs to be authenticated as an explorer and can only edit its own finder.
   *    requestBody:
   *     required: true
   *     content:
   *       application/json:
   *         schema:
   *           type: object
   *           properties:
   *             keyWord:
   *               type: string
   *               default:
   *             fromPrice:
   *               type: number
   *               default:
   *             toPrice:
   *               type: number
   *               default:
   *             fromDate:
   *               type: string
   *               default: 2023-10-10
   *             toDate:
   *               type: string
   *               default: 2023-11-11
   *    responses:
   *      200:
   *        description: Successful
   */
  app.route('/api/v0/Finder').put(isAuthorized([Role.Explorer]), updateFinder);

  /**
   * @swagger
   * /api/v0/Finder/Search:
   *   get:
   *    security:
   *       - bearerAuth: []
   *    summary: Get all based on finder.
   *    tags:
   *      - Finder
   *    description: Get all based on finder. Actor needs to be authenticated as an explorer.
   *    parameters:
   *      - name: keyWord
   *        in: path
   *        required: false
   *        description: The key word contained in the ticker.
   *        schema:
   *          type: string
   *      - name: fromPrice
   *        in: path
   *        required: false
   *        description: The from price.
   *        schema:
   *          type: number
   *      - name: toPrice
   *        in: path
   *        required: false
   *        description: The to price.
   *        schema:
   *          type: number
   *      - name: fromDate
   *        in: path
   *        required: false
   *        description: The from date.
   *        schema:
   *          type: date
   *      - name: toDate
   *        in: path
   *        required: false
   *        description: The to date.
   *        schema:
   *          type: date
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
    .route('/api/v0/Finder/Search')
    .get(isAuthorized([Role.Explorer]), findTrips);
}
