export enum AStatus {
  Accepted = 'ACCEPTED',
  Due = 'DUE',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}

export type ApplicationStatus = {
  status: AStatus;
  description: string;
};
