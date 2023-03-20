import { Types } from 'mongoose';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { Application } from '../models/Application';
import { ApplicationStatus } from '../models/ApplicationStatus';
import { Trip } from '../models/Trip';
import { AStatus } from './../models/ApplicationStatus';
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

const updateApplicationStatus = async (
  applicationId: string,
  applicationStatus: ApplicationStatus
): Promise<ApplicationStatus | null> => {
  if (!Types.ObjectId.isValid(applicationId)) {
    return null;
  }

  const trip = await TripModel.findOneAndUpdate(
    {
      'applications._id': applicationId,
    },
    {
      $set: {
        'applications.$.status': {
          status: applicationStatus.status,
          description: applicationStatus.description,
        },
      },
    }
  );

  if (!trip) {
    return null;
  }

  return applicationStatus;
};

const payTrip = async (
  applicationId: string,
  actorId: string
): Promise<Application | ErrorResponse> => {
  try {
    const applicationFind: Trip | null = await TripModel.findOne(
      {},
      { applications: { $elemMatch: { _id: applicationId } } }
    );

    if (!applicationFind) {
      return createErrorResponse('No application found.');
    }

    const application: Application = applicationFind.applications[0];

    if (!application) {
      return createErrorResponse('No application found.');
    }

    if (application.actorId != actorId) {
      return createErrorResponse('Needs to be authorized as the actor ');
    }

    if (application.status.status != AStatus.Due){
      return createErrorResponse('ApplicationStatus needs to be DUE');
    }

    //TODO IMPLEMENT ACTUAL PAYMENT WITH PAYPAL

    await TripModel.findOneAndUpdate(
      {
        'applications._id': applicationId,
      },
      {
        $set: {
          'applications.$.status': {
            status: AStatus.Accepted,
            description: 'Payment has been made.',
          },
        },
      }
    );

    application.status.status = AStatus.Accepted;
    application.status.description = 'Payment has been made.';

    return application;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

export const ApplicationRepository = {
  createApplication,
  getApplicationsByTrip,
  updateApplicationStatus,
  payTrip,
};
