import { Actor } from '../models/Actor';
import { Response, Request } from 'express';
import { ActorRepository } from '../repository/ActorRepository';
import Validator from './validators/Validator';
import { actorValidator } from './validators/ActorValidator';

export const getActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const actor: Actor | null = await ActorRepository.getActor(actorId);
  if (!actor) {
    return res.status(404).send(`Actor with id: ${actorId} could not be found`);
  }
  res.send(actor);
};

export const getActors = async (req: Request, res: Response) => {
  const actors: Actor[] = await ActorRepository.getActors();
  if (!actors) {
    res.status(404);
  }
  res.send(actors);
};

export const upadateActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const actor: Actor = req.body;
  const validate = Validator.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }
  await ActorRepository.updateActor(actorId, actor);
  res.send(actor);
};

export const deleteActor = async (req: Request, res: Response) => {
  const actorId: string = req.params.actorId;
  const isDeleted: boolean = await ActorRepository.deleteActor(actorId);

  if (!isDeleted) {
    res.status(404).send(`Did not find actor with id: ${actorId}`);
    return;
  }
  res.send('Actor successfully deleted');
};

export const createActor = async (req: Request, res: Response) => {
  const actor: Actor = req.body;
  const validate = Validator.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }

  await ActorRepository.createActor(actor);
  res.send(actor);
};
