import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { ApplicationStatus, AStatus } from '../models/ApplicationStatus';
import { Trip } from '../models/Trip';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { TripRepository } from '../repository/TripRepository';
import {
  ErrorResponse,
  isErrorResponse,
} from './../error_handling/ErrorResponse';
import {
  applicationStatusValidator,
  applicationValidator,
} from './validators/ApplicationValidator';
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

  const trip: Trip | null = await TripRepository.getTrip(application.tripId);
  if (!trip) {
    return res
      .send(404)
      .send('The trip you are trying to apply to does not exist');
  }

  if (!trip.isPublished) {
    return res
      .status(400)
      .send('You cannot apply for a Trip that is not published');
  }

  if (application.dateCreated < trip.startDate) {
    return res
      .status(400)
      .send('You cannot apply for a Trip that already has started');
  }

  const createdApplication: Application | ErrorResponse =
    await ApplicationRepository.createApplication(application);
  if (isErrorResponse(createApplication)) {
    res.send(500).send(createApplication.errorMessage);
  }
  res.send(createdApplication);
};

export const getApplicationsByTrip = async (req: Request, res: Response) => {
  const tripId = req.params.tripId;
  const applications: Application[] | ErrorResponse =
    await ApplicationRepository.getApplicationsByTrip(tripId);
  if (isErrorResponse(applications)) {
    res.status(404).send(applications.errorMessage);
  }
  res.send(applications);
};

export const changeApplicationStatus = async (req: Request, res: Response) => {
  const applicationId: string = req.params.applicationId;
  const applicationStatus: ApplicationStatus = req.body;

  const validate = Validator.compile<ApplicationStatus>(
    applicationStatusValidator
  );

  if (!validate(applicationStatus)) {
    return res.status(422).send(validate.errors);
  }

  const isDue: boolean = applicationStatus.status == AStatus.Due;
  const isRejected: boolean = applicationStatus.status == AStatus.Rejected;

  if (!isDue && !isRejected) {
    return res.status(422).send('Status need to be either REJECTED or DUE');
  }

  const application: ApplicationStatus | ErrorResponse =
    await ApplicationRepository.updateApplicationStatus(
      applicationId,
      applicationStatus
    );

  if (isErrorResponse(application)) {
    return res
      .status(404)
      .send(`Could not find Application with Id: ${applicationId}`);
  }

  return res.status(200).send('Application status was sucessfully updated');
};

export const cancelApplication = async (req: Request, res: Response) => {
  const applicationId: string = req.params.applicationId;
  const actorId: string = res.locals.actorId;
  const applicationStatus: ApplicationStatus = req.body;

  const validate = Validator.compile<ApplicationStatus>(
    applicationStatusValidator
  );

  if (!validate(applicationStatus)) {
    return res.status(422).send(validate.errors);
  }

  const isCancelled: boolean = applicationStatus.status == AStatus.Cancelled;

  if (!isCancelled) {
    return res.status(422).send('Status need to be CANCELLED');
  }

  const application: ApplicationStatus | ErrorResponse =
    await ApplicationRepository.cancelApplication(
      applicationId,
      actorId,
      applicationStatus
    );

  if (isErrorResponse(application)) {
    return res.status(404).send(application.errorMessage);
  }
  return res.status(200).send('Application was sucessfully cancelled.');
};

export const payTrip = async (req: Request, res: Response) => {
  const applicationId: string = req.params.applicationId;
  const actorId: string = res.locals.actorId;
  const application: Application | ErrorResponse =
    await ApplicationRepository.payTrip(applicationId, actorId);

  if (isErrorResponse(application)) {
    return res.status(400).send(application.errorMessage);
  }

  return res.send(application);
};
