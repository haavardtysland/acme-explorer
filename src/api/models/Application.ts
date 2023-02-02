import { Actor } from './Actor';
import { ApplicationStatus } from './ApplicationStatus';

export type Application = {
  dateCreated: Date;
  status: ApplicationStatus;
  comments: string[];
  actor: Actor;
};
