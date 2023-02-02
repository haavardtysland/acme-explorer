export enum Status {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
}

export type TripStatus = {
  status: Status;
  description: string;
};
