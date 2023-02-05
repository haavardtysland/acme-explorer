import { application } from 'express';
import mongoose, { Types } from 'mongoose';
import { Application } from '../models/Application';
import { Trip } from '../models/Trip';
import { TripModel } from './schemes/TripScheme';

const createApplication = async (
  application: Application
): Promise<Application | null> => {
  if (
    !Types.ObjectId.isValid(application.tripId) ||
    !Types.ObjectId.isValid(application.actorId)
  ) {
    return null;
  }
  const trip = await TripModel.findById(application.tripId);
  const update = { $push: { applications: application } };

  if (trip === null) {
    return null;
  }

  await trip.updateOne(update);
  return application;
};

const getApplicationsByTrip = async (
  tripId: string
): Promise<Application[] | null> => {
  if (!Types.ObjectId.isValid(tripId)) {
    return null;
  }
  const trip = await TripModel.findById(tripId);
  if (trip === null) {
    return null;
  }

  return trip.applications;
};

export const ApplicationRepository = {
  createApplication,
  getApplicationsByTrip,
};
