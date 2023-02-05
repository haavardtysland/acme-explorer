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


/* 
const getApplication = async (
  applicationId: string
): Promise<Application | null> => {
  return await ApplicationModel.findById(applicationId);
};

const getApplications = async (): Promise<Application[]> => {
  return await ApplicationModel.find();
};

const upadateApplication = async (applicationId: string): Promise<boolean> => {
  const res = await ApplicationModel.findOneAndUpdate({ applicationId });
  //retruns boolean for if it is successfull or not
  return res !== null;
};

const deleteApplication = async (applicationId: string): Promise<boolean> => {
  console.log(applicationId);
  const res = await ApplicationModel.deleteOne({ _id: applicationId });
  console.log(res);
  //retruns boolean for if it is successfull or not
  return res.deletedCount > 0;
}; */

export const ApplicationRepository = {
  createApplication,
  getApplicationsByTrip,
  /*   getApplication,
  deleteApplication,
  getApplications,
  upadateApplication, */
};
