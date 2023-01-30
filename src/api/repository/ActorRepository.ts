import { Actor } from '../models/Actor';
import { ActorModel } from './schemes/ActorScheme';

const createActor = async (actor: Actor): Promise<void> => {
  await ActorModel.create(actor);
};

const getActor = async (actorId: string): Promise<Actor | null> => {
  return await ActorModel.findById(actorId);
};

const getActors = async (): Promise<Actor[]> => {
  return await ActorModel.find();
};

const upadateActor = async (actorId: string): Promise<boolean> => {
  const res = await ActorModel.findOneAndUpdate({ actorId });
  //retruns boolean for if it is successfull or not
  return res !== null;
};

const deleteActor = async (actorId: string): Promise<boolean> => {
  console.log(actorId);
  const res = await ActorModel.deleteOne({ _id: actorId });
  console.log(res);
  //retruns boolean for if it is successfull or not
  return res.deletedCount > 0;
};

export const ActorRepository = {
  createActor,
  getActor,
  deleteActor,
  getActors,
  upadateActor,
};
