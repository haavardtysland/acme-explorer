import { Actor } from '../models/Actor';
import { ActorModel } from './schemes/ActorScheme';

const createActor = async (actor: Actor) => {
  await ActorModel.create(actor);
};

const getActor = async (actorId: string): Promise<Actor | null> => {
  return await ActorModel.findById(actorId);
};

export const ActorRepository = {
  createActor,
};
