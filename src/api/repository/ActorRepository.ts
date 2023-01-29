import { Actor } from '../models/Actor';
import { ActorModel } from './schemes/ActorScheme';

const createActor = async (actor: Actor) => {
  await ActorModel.create(actor).catch((err) => {
    console.log(err);
  });
};

export const ActorRepository = {
  createActor,
};
