import { FinderType, finderValidator } from './validators/FinderValidator';
import { Finder } from '../models/Finder';
import {
  ErrorResponse,
  isErrorResponse,
} from '../error_handling/ErrorResponse';
import { Request, Response } from 'express';
import Validator from './validators/Validator';
import { FinderRepository } from '../repository/FinderRepository';
import { Trip } from '../models/Trip';
import { ActorFinder } from '../models/ActorFinder';
import { actorFinderValidator } from './validators/ActorValidator';
import NodeCache from 'node-cache';
import { SystemSettings } from '../models/SystemSettings';
import { SystemSettingsModel } from '../repository/schemes/SystemSettingsScheme';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export const updateFinder = async (req: Request, res: Response) => {
  const actorId = res.locals.actorId;
  const finderObject: ActorFinder = req.body;
  const validate = Validator.compile<ActorFinder>(actorFinderValidator);

  if (!validate(finderObject)) {
    return res.status(400).send(validate.errors);
  }

  const response: ActorFinder | ErrorResponse =
    await FinderRepository.updateFinder(actorId, finderObject);

  if (isErrorResponse(response)) {
    return res.send(400).send(response.errorMessage);
  }

  return res.status(200).send('Finder successfully updated');
};

export const findTrips = async (req: Request, res: Response) => {
  /**const key = req.originalUrl;
  if (cache.has(key)) {
    console.log('got data from cache');
    const jsonString: string | undefined = cache.get(key);
    if (jsonString) {
      return res.status(200).send(JSON.parse(jsonString));
    }
  }*/
  //Searcher
  const request = {
    keyWord: req.query.keyWord,
    fromPrice: req.query.fromPrice,
    toPrice: req.query.toPrice,
    fromDate: req.query.fromDate,
    toDate: req.query.toDate,
  };

  const validate = Validator.compile<FinderType>(finderValidator);

  if (!validate(request)) {
    return res.status(400).send(validate.errors);
  }

  const finderParameters: Finder = {
    keyWord: request.keyWord,
    fromPrice: Number(request.fromPrice),
    toPrice: Number(request.toPrice),
    fromDate: new Date(String(request.fromDate)),
    toDate: new Date(String(request.toDate)),
  };

  const response: Trip[] | ErrorResponse = await FinderRepository.findTrips(
    finderParameters,
    res.locals.actorId
  );

  if (isErrorResponse(response)) {
    return res.status(500).send(response.errorMessage);
  }

  /**const systemSettings: SystemSettings | null =
    await SystemSettingsModel.findOne({
      name: 'systemSettings',
    });
  const cachingTime = systemSettings?.cachingTime || 3600;
  cache.set(key, JSON.stringify(response), cachingTime);
  console.log('put data into cache');*/
  return res.status(200).send(response);
};
