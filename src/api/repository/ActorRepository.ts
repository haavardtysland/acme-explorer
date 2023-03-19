import { Actor } from '../models/Actor';
import { ActorModel } from './schemes/ActorScheme';
import { hash } from 'bcryptjs';
import { Types } from 'mongoose';
import dotenv from 'dotenv';
import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { UpdateActorDto } from '../models/dtos/UpdateActorDto';
dotenv.config();

const createActor = async (actor: Actor): Promise<Actor | ErrorResponse> => {
  actor.password = await hash(actor.password, 8);
  try {
    const res: Actor = await ActorModel.create(actor);
    return res;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getActor = async (actorId: string): Promise<Actor | null> => {
  if (!Types.ObjectId.isValid(actorId)) {
    return null;
  }
  return await ActorModel.findById(actorId);
};

const getActors = async (): Promise<Actor[]> => {
  return await ActorModel.find();
};

const updateActor = async (
  actorId: string,
  updateActorDto: UpdateActorDto
): Promise<boolean | ErrorResponse> => {
  try {
    const doc = await ActorModel.findOne({ _id: actorId });
    if (!doc) {
      return false;
    }
    
    if (updateActorDto.password) {
      updateActorDto.password = await hash(updateActorDto.password, 8);
    }

    doc.set(updateActorDto);
    await doc.save();
    return true;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const deleteActor = async (actorId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(actorId)) {
    return false;
  }

  const res = await ActorModel.deleteOne({ _id: actorId });
  return res.deletedCount > 0;
};

const getUserByEmail = async (email: string): Promise<Actor | null> => {
  return await ActorModel.findOne({ email: email });
};

const changeBannedStatus = async (actorId: string): Promise<boolean | null> => {
  console.log(actorId);
  return await ActorModel.findByIdAndUpdate(
    { '_id:': actorId },
    {
      $set: { $isBanned: { isbanned: { $not: '$isBanned' } } },
    },
    { new: true }
  );
};

export const ActorRepository: IActorRepository = {
  createActor,
  getActor,
  deleteActor,
  getActors,
  updateActor,
  getUserByEmail,
  changeBannedStatus,
};
