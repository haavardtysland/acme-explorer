export type UpdateActorDto = {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  cacheDuration: number;
  numTripsFromFinder: number;
};
