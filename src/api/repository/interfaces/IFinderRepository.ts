import { ErrorResponse } from '../../error_handling/ErrorResponse';
import { ActorFinder } from '../../models/ActorFinder';
import { Finder } from '../../models/Finder';
import { Trip } from '../../models/Trip';

export interface IFinderRepository {
  findTrips: (parameters : Finder) => Promise<Trip[] | ErrorResponse>;
  updateFinder: (
    actorId: string,
    finder: Finder
  ) => Promise<ActorFinder | ErrorResponse>;
}