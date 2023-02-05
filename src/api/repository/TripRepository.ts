import { Types } from 'mongoose';
import { Trip } from '../models/Trip';
import { TripModel } from './schemes/TripScheme';

const createTrip = async (trip: Trip): Promise<Trip | null> => {
  const res = await TripModel.create(trip);
  return res;
};

const getTrip = async (tripId: string): Promise<Trip | null> => {
  return await TripModel.findById(tripId);
};

//TODO add search for tickers, titles, or descriptions.
const getTrips = async (): Promise<Trip[]> => {
  return await TripModel.find();
};

const upadateTrip = async (tripId: string): Promise<boolean> => {
  const res = await TripModel.findOneAndUpdate({ tripId });
  //retruns boolean for if it is successfull or not
  return res !== null;
};

const deleteTrip = async (tripId: string): Promise<boolean> => {
  const res = await TripModel.deleteOne({ _id: tripId });
  //retruns boolean for if it is successfull or not
  return res.deletedCount > 0;
};

const getTripsByActor = async (actorId: string): Promise<Trip[] | null> => {
  if (!Types.ObjectId.isValid(actorId)) {
    return null;
  }

  console.log(actorId);

  const applicationSearch = [
    {
      $unwind: '$applications',
    },
    {
      $match: {
        'applications.actorId': new Types.ObjectId(actorId),
      },
    },
  ];
  const trips = await TripModel.find(applicationSearch);

  return trips;
};

export const TripRepository = {
  createTrip,
  getTrip,
  deleteTrip,
  getTrips,
  upadateTrip,
  getTripsByActor,
};
