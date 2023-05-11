import { Types } from 'mongoose';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { ModifyTripResponse } from '../models/dtos/ModifyTripResponse';
import { UpdateTripDto } from '../models/dtos/UpdateTripDto';
import { Trip } from '../models/Trip';
import { AStatus } from './../models/ApplicationStatus';
import { TStatus } from './../models/TripStatus';
import { TripModel } from './schemes/TripScheme';
import { tr } from 'date-fns/locale';
import { type } from 'os';

const cancelTrip = async (
  tripId: string,
  managerId: string,
  description: string
): Promise<ModifyTripResponse> => {
  if (!Types.ObjectId.isValid(tripId)) {
    return {
      statusCode: 404,
      message: `Could not find Trip with Id: ${tripId}`,
      isModified: false,
    };
  }
  const doc = await TripModel.findById(tripId);

  if (!doc) {
    return {
      statusCode: 404,
      message: `Could not find Trip with Id: ${tripId}`,
      isModified: false,
    };
  }

  const response: ModifyTripResponse | null = canTripBeCancelled(
    tripId,
    managerId,
    doc
  );

  if (response) {
    return response;
  }

  doc.set({
    status: { status: TStatus.Cancelled, description: description },
  });

  await doc.save();
  return {
    isModified: true,
    statusCode: 200,
    message: 'Trip is cancelled',
  };
};

const createTrip = async (trip: Trip): Promise<Trip | ErrorResponse> => {
  try {
    const res = await TripModel.create(trip);
    return res;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getTrip = async (tripId: string): Promise<Trip | ErrorResponse> => {
  try {
    const trip: Trip | null = await TripModel.findById(tripId);
    if (!trip) {
      return createErrorResponse(`Could not find trip with id: ${tripId}`, 404);
    }
    return trip;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getTrips = async (): Promise<Trip[] | ErrorResponse> => {
  try {
    return await TripModel.find();
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const updateTrip = async (
  tripId: string,
  managerId: string,
  trip: UpdateTripDto
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

  doc.set(trip);
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

const getAppliedTrips = async (
  actorId: string
): Promise<Trip[] | ErrorResponse> => {
  try {
    const trips = await TripModel.find({
      'applications.explorerId': actorId,
    });
    return trips;
  } catch (error) {
    return createErrorResponse(error.message);
  }
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

  if (trip.startDate <= today) {
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

  //7 dager til den starter eller mindre
  const timeDiff = getTimeDiff(trip);
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (daysDiff >= 0 && daysDiff <= 7) {
    return {
      isModified: false,
      message: 'Its less than 7 days until the trip starts',
      statusCode: 405,
    };
  }

  //At tripén inneholder en applikasjon som er accepted
  const acceptedTrips = trip.applications.filter((app) => {
    return app.status.status == AStatus.Accepted;
  });
  if (acceptedTrips.length > 0) {
    return {
      isModified: false,
      message: 'The trip has applications that have been payed',
      statusCode: 405,
    };
  }

  return null;
};

const getTimeDiff = (trip: Trip) => {
  const startDate: Date | string = trip.startDate;
  let timeDiff = 0;
  if (startDate instanceof Date) {
    timeDiff = startDate.getTime() - new Date().getTime();
  } else {
    const date = new Date(startDate);
    timeDiff = date.getTime() - new Date().getTime();
  }
  return timeDiff;
};

const getTripsByManager = async (
  managerId: string
): Promise<Trip[] | ErrorResponse> => {
  try {
    const trips = await TripModel.find({
      managerId: managerId,
    });
    return trips;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getSearchedTrips = async (
  searchWord: string
): Promise<Trip[] | ErrorResponse> => {
  try {
    const response: Trip[] | null = await TripModel.find({
      $or: [
        { ticker: new RegExp(searchWord, 'i') },
        { title: new RegExp(searchWord, 'i') },
        { description: new RegExp(searchWord, 'i') },
      ],
    });
    return response;
  } catch (error) {
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
};
