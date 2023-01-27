enum Status {
  Active,
  Cancelled,
}

export type TripStatus = {
  status: Status;
  description: string;
};
