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
  const actor: Actor | null = await ActorRepository.getActor(actorId);
  if (!actor) {
    return res.status(404).send(`Actor with id: ${actorId} could not be found`);
  }
  return res.send(actor);
};

export const getActors = async (req: Request, res: Response) => {
  const actors: Actor[] = await ActorRepository.getActors();
  if (!actors) {
    return res.status(404);
  }
  return res.send(actors);
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
    return res.status(500).send(response.errorMessage);
  }
  res.send(request);
};

export const deleteActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const isDeleted: boolean = await ActorRepository.deleteActor(actorId);

  if (!isDeleted) {
    return res.status(404).send(`Did not find actor with id: ${actorId}`);
    
  }
  return res.send('Actor successfully deleted');
};

export const createActor = async (req: Request, res: Response) => {
  const actor: Actor = req.body;
  actor.role = Role.Explorer;
  actor.finder = {
    keyWord: '',
    fromPrice: 0,
    toPrice: 0,
    fromDate: '2021-01-01',
    toDate: '2030-01-01',
  };
  const validate = Validator.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }

  const response: Actor | ErrorResponse = await ActorRepository.createActor(
    actor
  );
  if (isErrorResponse(response)) {
    return res.send(400).send(response.errorMessage);
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
    return res.send(400).send(response.errorMessage);
  }
  return res.send(response);
};
