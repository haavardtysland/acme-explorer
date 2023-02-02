import mongoose from 'mongoose';
import { Trip } from '../../models/Trip';

const TripSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  stages: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
  picture: { data: Buffer, type: String, required: false },
  requirements: { type: [] },
  /*  {
      requirement: { type: String },
    }, */
  isPublished: { type: Boolean },
});

export const TripModel = mongoose.model<Trip>('Trips', TripSchema, 'Trips');
