import { Trip } from '../models/Trip';
import { TripModel } from './schemes/TripScheme';

const createTrip = async (trip: Trip): Promise<void> => {
  await TripModel.create(trip);
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
  console.log(tripId);
  const res = await TripModel.deleteOne({ _id: tripId });
  console.log(res);
  //retruns boolean for if it is successfull or not
  return res.deletedCount > 0;
};

export const TripRepository = {
  createTrip,
  getTrip,
  deleteTrip,
  getTrips,
  upadateTrip,
};
