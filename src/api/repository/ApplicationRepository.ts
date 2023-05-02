import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { Application } from '../models/Application';
import { ApplicationStatus } from '../models/ApplicationStatus';
import { Trip } from '../models/Trip';
import { AStatus } from './../models/ApplicationStatus';
import { TStatus } from './../models/TripStatus';
import { TripModel } from './schemes/TripScheme';

const createApplication = async (
  application: Application
): Promise<Application | ErrorResponse> => {
  try {
    const trip = await TripModel.findById(application.tripId);
    const update = { $push: { applications: application } };

    if (trip === null) {
      return createErrorResponse(
        `Could not find trip with tripId ${application.tripId}`
      );
    }

    if (!trip.isPublished || trip.status.status == TStatus.Cancelled) {
      return createErrorResponse(
        'You cannot apply for a Trip that is not published or is cancelled',
        405
      );
    }

    if (application.dateCreated < trip.startDate) {
      return createErrorResponse(
        'You cannot apply for a Trip that already has started',
        405
      );
    }

    await trip.updateOne(update);
    return application;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getApplicationsByTrip = async (
  tripId: string
): Promise<Application[] | ErrorResponse> => {
  try {
    const trip = await TripModel.findById(tripId);
    if (trip === null) {
      return createErrorResponse(`Could not find trip with tripId ${tripId}`);
    }
    return trip.applications;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const updateApplicationStatus = async (
  applicationId: string,
  applicationStatus: ApplicationStatus
): Promise<ApplicationStatus | ErrorResponse> => {
  try {
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
      return createErrorResponse(
        `Could not find trip with applicationId ${applicationId}`
      );
    }

    return applicationStatus;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const cancelApplication = async (
  applicationId: string,
  actorId: string,
  applicationStatus: ApplicationStatus
): Promise<ApplicationStatus | ErrorResponse> => {
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

    if (application.status.status != AStatus.Accepted) {
      return createErrorResponse(
        'Cannot cancelled application where status is not ACCEPTED'
      );
    }

    if (application.explorerId != actorId) {
      return createErrorResponse('Needs to be authorized as the actor ');
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
      return createErrorResponse('No application found');
    }
    return applicationStatus;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const payTrip = async (
  applicationId: string,
  actorId: string
): Promise<Application | ErrorResponse> => {
  try {
    const applicationFind: Trip | null = await TripModel.findOne({
      'applications._id': '643ecdabb74f0d3eececddbf',
    });

    if (!applicationFind) {
      return createErrorResponse('No application found.');
    }

    const application: Application = applicationFind.applications[0];

    if (!application) {
      return createErrorResponse('No application found.');
    }

    if (application.explorerId != actorId) {
      return createErrorResponse('Needs to be authorized as the actor ');
    }

    if (application.status.status != AStatus.Due) {
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
  cancelApplication,
  payTrip,
};
