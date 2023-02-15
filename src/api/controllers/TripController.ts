import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { Stage } from '../models/Stage';
import { Ticker } from '../models/Ticker';
import { Trip } from '../models/Trip';
import { TStatus } from '../models/TripStatus';
import { ModifyTripResponse } from '../repository/dtos/TripModels';
import { TripRepository } from '../repository/TripRepository';
import { tripValidator } from './validators/TripValidator';
import Validadtor from './validators/Validator';

export const getTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const trip: Trip | null = await TripRepository.getTrip(tripId);
  if (!trip) {
    return res.status(404).send(`Trip with id: ${tripId} could not be found`);
  }
  res.send(trip);
};

export const getTrips = async (req: Request, res: Response) => {
  const trips: Trip[] = await TripRepository.getTrips();
  if (!trips) {
    return res.status(404);
  }
  res.send(trips);
};

export const updateTrip = async (req: Request, res: Response) => {
  const trip: Trip = req.body;
  const tripId: string = req.params.tripId;
  const managerId = res.locals.actorId;
  const validate = Validadtor.compile<Trip>(tripValidator);

  if (!validate(trip)) {
    return res.status(422).send(validate.errors);
  }

  const response: ModifyTripResponse = await TripRepository.upadateTrip(
    tripId,
    managerId,
    trip
  );

  res.status(response.statusCode).send(response.message);
};

export const deleteTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const managerId = res.locals.actorId;
  const response: ModifyTripResponse = await TripRepository.deleteTrip(
    tripId,
    managerId
  );
  res.status(response.statusCode).send(response.message);
};

export const cancelTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const managerId: string = res.locals.actorId;
  const response: ModifyTripResponse = await TripRepository.cancelTrip(
    tripId,
    managerId
  );
  res.status(response.statusCode).send(response.message);
};

export const createTrip = async (req: Request, res: Response) => {
  const trip: Trip = req.body;
  trip.ticker = Ticker.newTicker();
  trip.totalPrice = calculateTotalPrice(trip.stages);
  trip.managerId = res.locals.actorId;
  trip.isPublished = false;
  trip.status = {
    status: TStatus.Active,
    description: 'Trip created',
  };

  const validate = Validadtor.compile<Trip>(tripValidator);

  if (!validate(trip)) {
    return res.status(422).send(validate.errors);
  }

  const createdTrip: Trip | null = await TripRepository.createTrip(trip);
  if (!createdTrip) {
    return res.send(500).send('Did not manage to create Trip');
  }

  return res.send(createdTrip);
};

const calculateTotalPrice = (stages: Stage[]): number => {
  return stages.reduce((sum: number, stage: Stage) => sum + stage.price, 0);
};

export const getAppliedTrips = async (req: Request, res: Response) => {
  const actorId = req.params.actorId;
  const trips: Trip[] | null = await TripRepository.getAppliedTrips(actorId);
  if (!trips) {
    return res.status(404).send(`Could not find actor with Id: ${actorId}`);
  }
  res.send(sortTripsByApplicationStatus(trips, actorId));
};

const getApplication = (trip: Trip, actorId: string): Application => {
  //snekker
  const application: Application | undefined = trip.applications.find(
    (app) => app.actorId == actorId
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
  const trips: Trip[] | null = await TripRepository.getTripsByManager(
    managerId
  );
  if (!trips) {
    return res.status(404).send(`Could not find manager with Id: ${managerId}`);
  }
  res.send(trips);
};

export const getSearchedTrips = async (req: Request, res: Response) => {
  const searchWord = req.params.searchWord;
  const trips: Trip[] | null = await TripRepository.getSearchedTrips(
    searchWord
  );
  if (!trips) {
    return res
      .status(404)
      .send(`No trips matched the searchword: ${searchWord}`);
  }
  res.status(200).send(trips);
};
