import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { Finder } from '../models/Finder';
import { Trip } from '../models/Trip';
import { TripModel } from './schemes/TripScheme';
import { Types } from 'mongoose';
import { ActorModel } from './schemes/ActorScheme';
import { ActorFinder } from '../models/ActorFinder';
import { create } from 'domain';
import { IFinderRepository } from './interfaces/IFinderRepository';

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

const updateFinder = async (
  actorId: string,
  finder: ActorFinder
): Promise<ActorFinder | ErrorResponse> => {
  try {
    const actor = await ActorModel.findOneAndUpdate(
      { 'actors._id': actorId },
      {
        $set: {
          'actors.$.finder': {
            keyword: finder.keyWord,
            fromPrice: finder.fromPrice,
            toPrice: finder.fromPrice,
            fromDate: finder.fromDate,
            toDate: finder.toDate,
          },
        },
      }
    );
  } catch (error) {
    return createErrorResponse(error.message);
  }
  return finder;
};

export const FinderRepository = { findTrips, updateFinder };
