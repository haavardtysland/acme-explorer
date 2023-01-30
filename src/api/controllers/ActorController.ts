import { Actor } from '../models/Actor';
import { Response, Request } from 'express';
import { ActorRepository } from '../repository/ActorRepository';
import Ajv from 'ajv';
import { actorValidator } from './validators/ActorValidator';

const ajv = new Ajv();

export const getActors = async (req: Request, res: Response) => {
  //jihaa
};

export const login = async (req: Request, res: Response) => {
  //Login and return token!
};

export const createActor = async (req: Request, res: Response) => {
  const actor: Actor = req.body;
  const validate = ajv.compile<Actor>(actorValidator);

  if (!validate(actor)) {
    return res.status(422).send(validate.errors);
  }

  await ActorRepository.createActor(actor);
  res.send(actor);
};
