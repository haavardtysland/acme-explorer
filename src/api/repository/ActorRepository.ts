import { Actor } from '../models/Actor';
import { ActorModel } from './schemes/ActorScheme';
import { hash } from 'bcryptjs';
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
    if (!res) {
      return createErrorResponse('Could not create actor', 500);
    }
    return res;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getActor = async (actorId: string): Promise<Actor | ErrorResponse> => {
  try {
    const actor: Actor | null = await ActorModel.findById(actorId);
    if (!actor) {
      return createErrorResponse(
        `Could not find actor with id: ${actorId}`,
        404
      );
    }
    return actor;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getActors = async (): Promise<Actor[] | ErrorResponse> => {
  try {
    const actors: Actor[] | null = await ActorModel.find();
    if (!actors) {
      return createErrorResponse(`Could not find list of actors`, 404);
    }
    return actors;
  } catch (error) {
    return createErrorResponse(error.message);
  }
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

const deleteActor = async (
  actorId: string
): Promise<boolean | ErrorResponse> => {
  try {
    const response = await ActorModel.deleteOne({ _id: actorId });
    if (response.deletedCount <= 0) {
      return createErrorResponse(
        `Could not find actor with actorId ${actorId}`,
        404
      );
    }
    return response.deletedCount > 0;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const getUserByEmail = async (
  email: string
): Promise<Actor | ErrorResponse> => {
  try {
    const actor: Actor | null = await ActorModel.findOne({ email: email });
    if (!actor) {
      return createErrorResponse(
        `Could not find actor with email ${email} `,
        404
      );
    }
    return actor;
  } catch (error) {
    return createErrorResponse(error.message);
  }
};

const changeBannedStatus = async (
  actorId: string,
  isBanned: boolean
): Promise<boolean | ErrorResponse> => {
  try {
    const response: boolean | null = await ActorModel.findOneAndUpdate(
      { _id: actorId },

      [{ $set: { isBanned: isBanned } }],
      { new: true }
    );
    if (!response) {
      return createErrorResponse(
        `Could not find actor with actorId ${actorId}`,
        404
      );
    }
    return response;
  } catch (err) {
    return createErrorResponse(err.message);
  }
};

export const ActorRepository  = {
  createActor,
  getActor,
  deleteActor,
  getActors,
  updateActor,
  getUserByEmail,
  changeBannedStatus,
};
