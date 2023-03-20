import { ErrorResponse } from '../../error_handling/ErrorResponse';
import { Actor } from '../../models/Actor';
import { UpdateActorDto } from '../../models/dtos/UpdateActorDto';

export interface IActorRepository {
  createActor: (actor: Actor) => Promise<Actor | ErrorResponse>;
  getActor: (actorId: string) => Promise<Actor | ErrorResponse>;
  getActors: () => Promise<Actor[] | ErrorResponse>;
  updateActor: (
    actorId: string,
    actor: UpdateActorDto
  ) => Promise<boolean | ErrorResponse>;
  deleteActor: (actorId: string) => Promise<boolean | ErrorResponse>;
  getUserByEmail: (email: string) => Promise<Actor | ErrorResponse>;
  changeBannedStatus: (
    actorId: string,
    isbanned: boolean
  ) => Promise<boolean | ErrorResponse>;
}
