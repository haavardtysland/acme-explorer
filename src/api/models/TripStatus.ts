export enum TStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
}

export type TripStatus = {
  status: TStatus;
  description: string;
};
