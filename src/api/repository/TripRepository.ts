import { Types } from 'mongoose';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { FinderParameters } from '../models/FinderParameters';
import { Trip } from '../models/Trip';
import { AStatus } from './../models/ApplicationStatus';
import { TStatus } from './../models/TripStatus';
import { ModifyTripResponse } from './dtos/TripModels';
import { TripModel } from './schemes/TripScheme';
import startOfDay from 'date-fns/startOfDay';

const cancelTrip = async (
  tripId: string,
  managerId: string
): Promise<ModifyTripResponse> => {
  const doc = await TripModel.findById(tripId);

  const response: ModifyTripResponse | null = canTripBeCancelled(
    tripId,
    managerId,
    doc
  );

  if (response) {
    return response;
  }

  if (!doc) {
    return {
      statusCode: 404,
      message: `Could not find Trip with Id: ${tripId}`,
      isModified: false,
    };
  }

  doc.overwrite({
    status: { status: TStatus.Cancelled, description: 'Trip is cancelled' },
  });

  await doc.save();
  return {
    isModified: true,
    statusCode: 200,
    message: 'Trip is cancelled',
  };
};

const createTrip = async (trip: Trip): Promise<Trip | null> => {
  const res = await TripModel.create(trip);
  return res;
};

const getTrip = async (tripId: string): Promise<Trip | null> => {
  if (!Types.ObjectId.isValid(tripId)) {
    return null;
  }
  return await TripModel.findById(tripId);
};

const getTrips = async (): Promise<Trip[]> => {
  return await TripModel.find();
};

const updateTrip = async (
  tripId: string,
  managerId: string,
  trip: Trip
): Promise<ModifyTripResponse> => {
  const doc = await TripModel.findOne({ _id: tripId });

  const response: ModifyTripResponse | null = isTripModifiable(
    tripId,
    managerId,
    doc
  );

  if (response) {
    return response;
  }

  if (!doc) {
    return {
      statusCode: 404,
      message: `Could not find Trip with Id: ${tripId}`,
      isModified: false,
    };
  }

  doc.overwrite(trip);
  await doc.save();
  return {
    isModified: true,
    statusCode: 200,
    message: 'Trip is updated',
  };
};

const deleteTrip = async (
  tripId: string,
  managerId: string
): Promise<ModifyTripResponse> => {
  const trip: Trip | null = await TripModel.findById(tripId);

  const response: ModifyTripResponse | null = isTripModifiable(
    tripId,
    managerId,
    trip
  );

  if (response) {
    return response;
  }

  const res = await TripModel.deleteOne({ _id: tripId });
  if (res.deletedCount < 0) {
    return {
      isModified: false,
      message: 'Could not modify trip',
      statusCode: 500,
    };
  }

  return {
    isModified: true,
    message: 'Trip deleted',
    statusCode: 200,
  };
};

const getAppliedTrips = async (actorId: string): Promise<Trip[] | null> => {
  if (!Types.ObjectId.isValid(actorId)) {
    return null;
  }

  const trips = await TripModel.find({
    'applications.actorId': actorId,
  });

  return trips;
};

const canTripBeCancelled = (
  tripId: string,
  managerId: string,
  trip: Trip | null
): ModifyTripResponse | null => {
  if (trip === null) {
    return {
      isModified: false,
      message: `Trip with Id: ${tripId} does not exist`,
      statusCode: 404,
    };
  }

  if (trip.managerId !== managerId) {
    return {
      isModified: false,
      message: 'You have to be the manager for this trip to modify it',
      statusCode: 403,
    };
  }
  const today: Date = new Date();

  if (trip.startDate >= today) {
    return {
      isModified: false,
      message: 'You cannot cancel the trip as it has already started',
      statusCode: 403,
    };
  }

  if (!trip.isPublished) {
    return {
      isModified: false,
      message: 'You can only cancel the trip if it has been published',
      statusCode: 403,
    };
  }

  trip.applications.forEach((application) => {
    if (application.status.status === AStatus.Accepted) {
      return {
        isModified: false,
        message: 'You cannot cancel a trip which has any accepted applications',
        statusCode: 403,
      };
    }
  });

  return null;
};

const isTripModifiable = (
  tripId: string,
  managerId: string,
  trip: Trip | null
): ModifyTripResponse | null => {
  if (trip === null) {
    return {
      isModified: false,
      message: `Trip with Id: ${tripId} does not exist`,
      statusCode: 404,
    };
  }

  if (trip.managerId !== managerId) {
    return {
      isModified: false,
      message: 'You have to be the manager for this trip to modify it',
      statusCode: 403,
    };
  }

  if (trip.isPublished) {
    return {
      isModified: false,
      message: 'You cannot modify a trip that has been published',
      statusCode: 405,
    };
  }
  return null;
};

const getTripsByManager = async (managerId: string): Promise<Trip[] | null> => {
  if (!Types.ObjectId.isValid(managerId)) {
    return null;
  }

  const trips = await TripModel.find({
    managerId: managerId,
  });

  return trips;
};

const getSearchedTrips = async (searchWord: string): Promise<Trip[] | null> => {
  const response: Trip[] | null = await TripModel.find({
    $or: [
      { ticker: new RegExp(searchWord, 'i') },
      { title: new RegExp(searchWord, 'i') },
      { description: new RegExp(searchWord, 'i') },
    ],
  });
  return response;
};

const findTrips = async (
  parameters: FinderParameters
): Promise<Trip[] | ErrorResponse> => {
  try {
    console.log(parameters);
    const query = TripModel.find();
    if (parameters.fromPrice) {
      query.where('totalPrice', { $gte: parameters.fromPrice });
    }

    if (parameters.toPrice) {
      query.where('totalPrice', { $lte: parameters.toPrice });
    }

    if (parameters.keyWord) {
      query.where({
        $or: [
          { ticker: new RegExp(parameters.keyWord, 'i') },
          { title: new RegExp(parameters.keyWord, 'i') },
          { description: new RegExp(parameters.keyWord, 'i') },
        ],
      });
    }

    if (parameters.fromDate) {
      query.where('startDate', { $gte: startOfDay(parameters.fromDate) });
    }

    if (parameters.toDate) {
      query.where('endDate', { $lte: startOfDay(parameters.toDate) });
    }

    return await query.exec();
  } catch (error) {
    console.log(error);
    return createErrorResponse(error.message);
  }
};

export const TripRepository = {
  cancelTrip,
  createTrip,
  getTrip,
  deleteTrip,
  getTrips,
  updateTrip,
  getAppliedTrips,
  getTripsByManager,
  getSearchedTrips,
  findTrips,
};
