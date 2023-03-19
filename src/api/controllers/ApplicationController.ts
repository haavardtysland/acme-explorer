import { Request, Response } from 'express';
import { Application } from '../models/Application';
import { ApplicationStatus, AStatus } from '../models/ApplicationStatus';
import { Trip } from '../models/Trip';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { TripRepository } from '../repository/TripRepository';
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

  const application: ApplicationStatus | null =
    await ApplicationRepository.updateApplicationStatus(
      applicationId,
      applicationStatus
    );

  if (!application) {
    return res
      .status(404)
      .send(`Could not find Application with Id: ${applicationId}`);
  }

  return res.status(200).send('Application status was sucessfully updated');
};

export const payTrip = (req: Request, res: Response) => {
  res.status(501).send('Payment is not implemented');
};
