import { Application } from './Application';
import { Picture } from './Picture';
import { Stage } from './Stage';
import { TripStatus } from './TripStatus';

export type Trip = {
  _id: string;
  managerId: string;
  ticker: string;
  title: string;
  description: string;
  totalPrice: number;
  startDate: string | Date;
  endDate: string | Date;
  status: TripStatus;
  stages: Stage[];
  pictures?: string[];
  requirements: string[];
  isPublished: boolean;
  applications: Application[];
};
