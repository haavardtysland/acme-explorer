import { Actor } from '../models/Actor';
import { Response, Request } from 'express';

export const getActors = async (req: Request, res: Response) => {
  const actors = [];
  const actor: Actor = {
    name: 'navn',
    surename: 'navnesen',
    email: 'voff',
    role: 1,
  };
  actors.push(actor);
  res.send(actors);
};
