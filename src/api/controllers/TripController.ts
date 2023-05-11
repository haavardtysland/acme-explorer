import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import {
  ErrorResponse,
  isErrorResponse,
} from '../error_handling/ErrorResponse';
import { Application } from '../models/Application';
import { ModifyTripResponse } from '../models/dtos/ModifyTripResponse';
import { UpdateTripDto } from '../models/dtos/UpdateTripDto';
import { Picture } from '../models/Picture';
import { Stage } from '../models/Stage';
import { Ticker } from '../models/Ticker';
import { Trip } from '../models/Trip';
import { TStatus } from '../models/TripStatus';
import { TripRepository } from '../repository/TripRepository';
import { tripValidator, updateTripValidator } from './validators/TripValidator';
import Validadtor from './validators/Validator';

export const getTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const response: Trip | ErrorResponse = await TripRepository.getTrip(tripId);
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const getTrips = async (req: Request, res: Response) => {
  const response: Trip[] | ErrorResponse = await TripRepository.getTrips();
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const updateTrip = async (req: Request, res: Response) => {
  const trip: UpdateTripDto = req.body;
  const tripId: string = req.params.tripId;
  const managerId = res.locals.actorId;
  const validate = Validadtor.compile<UpdateTripDto>(updateTripValidator);

  if (!validate(trip)) {
    return res.status(422).send(validate.errors);
  }

  const response: ModifyTripResponse = await TripRepository.updateTrip(
    tripId,
    managerId,
    trip
  );

  return res.status(response.statusCode).send(response.message);
};

export const deleteTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const managerId = res.locals.actorId;
  const response: ModifyTripResponse = await TripRepository.deleteTrip(
    tripId,
    managerId
  );
  return res.status(response.statusCode).send(response.message);
};

export const cancelTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const managerId: string = res.locals.actorId;
  const response: ModifyTripResponse = await TripRepository.cancelTrip(
    tripId,
    managerId
  );
  return res.status(response.statusCode).send(response.message);
};

export const createTrip = async (req: Request, res: Response) => {
  const trip: Trip = req.body;
  trip.ticker = Ticker.newTicker();
  trip.managerId = res.locals.actorId;
  trip.isPublished = false;
  trip.applications = [];
  trip.status = {
    status: TStatus.Active,
    description: 'Trip created',
  };
  if (trip.stages == null && trip.requirements == null) {
    trip.stages = JSON.parse(req.body.stages);
    trip.requirements = JSON.parse(req.body.requirements);
  }
  trip.totalPrice = calculateTotalPrice(trip.stages);
  const files = req.files as Express.Multer.File[];
  if (files) {
    const pictures: Picture[] = [];

    files.forEach((file) => {
      pictures.push({
        name: file.originalname,
        description: '', //TODO Maybe add description to the pucture
        img: {
          data: fs.readFileSync(
            path.join(__dirname.slice(0, -20) + '/pictures/' + file.filename)
          ),
          contentType: 'image/png',
        },
      });
    });
    trip.pictures = pictures;
  }

  const validate = Validadtor.compile<Trip>(tripValidator);

  if (!validate(trip)) {
    return res.status(422).send(validate.errors);
  }

  const response: Trip | ErrorResponse = await TripRepository.createTrip(trip);
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }

  return res.send(response);
};

const calculateTotalPrice = (stages: Stage[]): number => {
  return stages.reduce((sum: number, stage: Stage) => sum + stage.price, 0);
};

export const getAppliedTrips = async (req: Request, res: Response) => {
  const actorId = req.params.actorId;
  const response: Trip[] | ErrorResponse = await TripRepository.getAppliedTrips(
    actorId
  );
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(sortTripsByApplicationStatus(response, actorId));
};

const getApplication = (trip: Trip, actorId: string): Application => {
  //snekker
  const application: Application | undefined = trip.applications.find(
    (app) => app.explorerId.toString() == actorId
  );

  if (!application) {
    return {} as Application;
  }
  return application;
};

const sortTripsByApplicationStatus = (trips: Trip[], actorId: string) => {
  const sortedTrips = trips.sort((n1, n2) => {
    const app1 = getApplication(n1, actorId);
    const app2 = getApplication(n2, actorId);
    return app1.status.status.localeCompare(app2.status.status);
  });
  return sortedTrips;
};

export const getTripsByManager = async (req: Request, res: Response) => {
  const managerId = req.params.managerId;
  const response: Trip[] | ErrorResponse =
    await TripRepository.getTripsByManager(managerId);
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const getSearchedTrips = async (req: Request, res: Response) => {
  const searchWord = req.params.searchWord;
  const response: Trip[] | ErrorResponse =
    await TripRepository.getSearchedTrips(searchWord);

  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  res.status(200).send(response);
};
