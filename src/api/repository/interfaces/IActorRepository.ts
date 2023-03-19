import { ErrorResponse } from '../../error_handling/ErrorResponse';
import { Actor } from '../../models/Actor';
import { UpdateActorDto } from '../../models/dtos/UpdateActorDto';

export interface IActorRepository {
  createActor: (actor: Actor) => Promise<Actor | ErrorResponse>;
  getActor: (actorId: string) => Promise<Actor | null>;
  getActors: () => Promise<Actor[]>;
  updateActor: (actorId: string, actor: UpdateActorDto) => Promise<boolean>;
  deleteActor: (actorId: string) => Promise<boolean>;
  getUserByEmail: (email: string) => Promise<Actor | null>;
  changeBannedStatus: (actorId: string) => Promise<boolean | null>;
}
