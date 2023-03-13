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

export const updateFinder = () => {
  //Do something
};

export const findTrips = async (req: Request, res: Response) => {
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
    finderParameters
  );

  if (isErrorResponse(response)) {
    console.log('hore');
    return res.status(500).send(response.errorMessage);
  }

  return res.status(200).send(response);
};
