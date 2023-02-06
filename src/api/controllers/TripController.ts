import { Request, Response } from 'express';
import { Stage } from '../models/Stage';
import { Ticker } from '../models/Ticker';
import { Trip } from '../models/Trip';
import { TStatus } from '../models/TripStatus';
import { ModifyTripResponse } from '../repository/models/TripModels';
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
    res.status(404);
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
    res.send(500).send('Did not manage to create Trip');
  }

  res.send(createdTrip);
};

const calculateTotalPrice = (stages: Stage[]): number => {
  return stages.reduce((sum: number, stage: Stage) => sum + stage.price, 0);
};

export const getTripByActor = async (req: Request, res: Response) => {
  const actorId = req.params.actorId;
  const trips: Trip[] | null = await TripRepository.getTripsByActor(actorId);
  if (!trips) {
    res.status(404).send(`Could not find actor with Id: ${actorId}`);
  }
  res.send(trips);
};

export const getTripsByManager = async (req: Request, res: Response) => {
  const managerId = req.params.managerId;
  const trips: Trip[] | null = await TripRepository.getTripsByManager(
    managerId
  );
  if (!trips) {
    res.status(404).send(`Could not find manager with Id: ${managerId}`);
  }
  res.send(trips);
};
