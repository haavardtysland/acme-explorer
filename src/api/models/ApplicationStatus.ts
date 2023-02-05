export enum Status {
  Accepted = 'ACCEPTED',
  Due = 'DUE',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}

export type ApplicationStatus = {
  status: Status;
  description: string;
};
