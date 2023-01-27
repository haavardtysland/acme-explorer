enum Status {
  Accepted,
  Due,
  Pending,
  Rejected,
  Cancelled,
}

export type ApplicationStatus = {
  status: Status;
  description: string;
};
