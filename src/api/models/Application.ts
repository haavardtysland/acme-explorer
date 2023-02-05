import { Actor } from './Actor';
import { ApplicationStatus } from './ApplicationStatus';

export type Application = {
  _id: string; 
  dateCreated: string | Date;
  status: ApplicationStatus;
  comments: string[];
  actorId: string;
  tripId: string;
};
