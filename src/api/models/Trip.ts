import { Stage } from './Stage';
import { TripStatus } from './TripStatus';

export type Trip = {
  _id: string;
  ticker: string;
  title: string;
  description: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  status: TripStatus;
  stages: Stage[];
  pictures?: string[];
  requirements: string[];
  isPublished: boolean;
};
