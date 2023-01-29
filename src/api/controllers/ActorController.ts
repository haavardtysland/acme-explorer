import { Actor } from '../models/Actor';
import { Response, Request, response } from 'express';
import { ActorRepository } from '../repository/ActorRepository';

export const getActors = async (req: Request, res: Response) => {
  const actors = [];
  const actor: Actor = {
    name: 'navn',
    surename: 'navnesen',
    email: 'voff',
    role: 1,
    password: 'pass',
  };
  actors.push(actor);
  res.send(actors);
};

export const login = async (req: Request, res: Response) => {
  //Login and return token!
};

export const createActor = async (req: Request, res: Response) => {
  console.log('prøver å poste');
  const actor: Actor = req.body;
  console.log(actor);
  await ActorRepository.createActor(actor);
  res.send();
};
