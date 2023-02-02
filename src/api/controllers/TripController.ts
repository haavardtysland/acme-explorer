import { Trip } from '../models/Trip';
import { Response, Request } from 'express';
import { TripRepository } from '../repository/TripRepository';
import Validadtor from './validators/Validator';
import { tripValidator } from './validators/TripValidator';
import { Ticker } from '../models/Ticker';
import { Stage } from '../models/Stage';

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
  const validate = Validadtor.compile<Trip>(tripValidator);

  if (!validate(trip)) {
    return res.status(422).send(validate.errors);
  }

  if (!trip) {
    return res.status(404).send('Trip not found');
  }

  await TripRepository.upadateTrip(trip._id);
  res.send(trip);
};

export const deleteTrip = async (req: Request, res: Response) => {
  const tripId: string = req.params.tripId;
  const isDeleted: boolean = await TripRepository.deleteTrip(tripId);

  if (!isDeleted) {
    res.status(404).send('Trip could not be deleted');
    return;
  }
  res.send('Trip successfully deleted');
};

export const createTrip = async (req: Request, res: Response) => {
  const trip: Trip = req.body;
  trip.ticker = Ticker.newTicker();
  trip.totalPrice = calculateTotalPrice(trip.stages);

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
