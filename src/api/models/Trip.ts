import { Stage } from './Stage';
import { TripStatus } from './TripStatus';

export type Trip = {
  ticker: number;
  title: string;
  description: string;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
  status: TripStatus;
  stages: Stage[];
  pictures?: string[];
  requirements: string[];
};
