import { ActorFinder } from './ActorFinder';

export enum Role {
  Administrator = 'ADMINISTRATOR',
  Manager = 'MANAGER',
  Explorer = 'EXPLORER',
}

export type Actor = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address?: string;
  role: Role;
  password: string;
  isBanned: boolean;
  finder: ActorFinder;
  cacheDuration: number; 
  numTripsFromFinder: number; 
};
