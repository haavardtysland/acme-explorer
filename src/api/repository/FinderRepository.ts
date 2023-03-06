import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { Finder } from '../models/Finder';
import { Trip } from '../models/Trip';
import { TripModel } from './schemes/TripScheme';

const findTrips = async (
  parameters: Finder
): Promise<Trip[] | ErrorResponse> => {
  try {
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

    if (parameters.fromDate && !isNaN(parameters.fromDate.getTime())) {
      query.where('startDate', { $gte: startOfDay(parameters.fromDate) });
    }

    if (parameters.toDate && !isNaN(parameters.toDate.getTime())) {
      query.where('endDate', { $lte: startOfDay(parameters.toDate) });
    }

    return await query.exec();
  } catch (error) {
    console.log(error);
    return createErrorResponse(error.message);
  }
};

const putFinder = (actorId: string, finder: Finder) => {
  //Endre finderen til en actor
};

export const FinderRepository = { findTrips, putFinder };
