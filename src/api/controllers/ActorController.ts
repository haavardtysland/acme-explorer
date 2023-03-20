import { Request, Response } from 'express';
import {
  ErrorResponse,
  isErrorResponse,
} from '../error_handling/ErrorResponse';
import { Actor, Role } from '../models/Actor';
import { UpdateActorDto } from '../models/dtos/UpdateActorDto';
import { ActorRepository } from '../repository/ActorRepository';
import {
  actorValidator,
  updateActorValidator,
} from './validators/ActorValidator';
import Validator from './validators/Validator';

export const getActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const response: Actor | ErrorResponse = await ActorRepository.getActor(
    actorId
  );
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const getActors = async (req: Request, res: Response) => {
  const response: Actor[] | ErrorResponse = await ActorRepository.getActors();
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const updateActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const request: UpdateActorDto = req.body;
  const validate = Validator.compile<UpdateActorDto>(updateActorValidator);

  if (!validate(request)) {
    return res.status(422).send(validate.errors);
  }
  const response = await ActorRepository.updateActor(actorId, request);
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(request);
};

export const deleteActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const response: boolean | ErrorResponse = await ActorRepository.deleteActor(
    actorId
  );

  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send('Actor successfully deleted');
};

export const createActor = async (req: Request, res: Response) => {
  const actor: Actor = req.body;
  actor.role = Role.Explorer;
  actor.isBanned = false;
  actor.finder = {
    keyWord: null,
    fromPrice: null,
    toPrice: null,
    fromDate: null,
    toDate: null,
  };
  const validate = Validator.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }

  const response: Actor | ErrorResponse = await ActorRepository.createActor(
    actor
  );
  if (isErrorResponse(response)) {
    return res.status(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const createManager = async (req: Request, res: Response) => {
  const actor: Actor = req.body;
  actor.role = Role.Manager;
  const validate = Validator.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }

  const response: Actor | ErrorResponse = await ActorRepository.createActor(
    actor
  );
  if (isErrorResponse(response)) {
    return res.send(response.code).send(response.errorMessage);
  }
  return res.send(response);
};

export const changeBannedStatus = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const isBanned = req.body.isBanned;
  if (typeof isBanned != 'boolean') {
    return res.status(422).send('You need to send in a true or false');
  }
  const response: boolean | ErrorResponse =
    await ActorRepository.changeBannedStatus(actorId, isBanned);
  if (isErrorResponse(response)) {
    return res.send(response.code).send(response.errorMessage);
  }
  return res.send(response);
};
