import { Request, Response } from 'express';
import { Application } from '../models/Application';

import { AStatus } from '../models/ApplicationStatus';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { applicationValidator } from './validators/ApplicationValidator';
import Validator from './validators/Validator';

export const createApplication = async (req: Request, res: Response) => {
  const application: Application = req.body;
  application.dateCreated = new Date().toISOString().substring(0, 10);
  application.status = {
    description: 'Waiting for payment',
    status: AStatus.Pending,
  };

  const validate = Validator.compile<Application>(applicationValidator);

  if (!validate(application)) {
    return res.status(422).send(validate.errors);
  }

  const createdApplication: Application | null =
    await ApplicationRepository.createApplication(application);
  if (!createApplication) {
    res.send(500).send('Did not manage to submit application');
  }
  res.send(createdApplication);
};

export const getApplicationsByTrip = async (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const applications: Application[] | null =
    await ApplicationRepository.getApplicationsByTrip(tripId);
  if (!applications) {
    res.status(404);
  }
  res.send(applications);
};
