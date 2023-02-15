import mongoose, { Schema } from 'mongoose';
import { Trip } from '../../models/Trip';

const TripSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  managerId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    status: { type: String, required: true, enum: ['ACTIVE, CANCELLED'] },
    description: { type: String, required: true },
  },
  stages: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
  pictures: [
    {
      name: { type: String },
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
    },
  ],
  requirements: { type: [] },
  applications: [
    {
      dateCreated: { type: Date, required: true },
      status: {
        status: {
          type: String,
          required: true,
          enum: ['ACCEPTED', 'DUE', 'PENDING', 'REJECTED', 'CANCELLED'],
        },
        description: { type: String, required: true },
      },
      comments: { type: [], required: false },
      actorId: { type: Schema.Types.ObjectId, required: true, unique: true },
      tripId: { type: Schema.Types.ObjectId, required: true },
    },
  ],
  isPublished: { type: Boolean },
});

export const TripModel = mongoose.model<Trip>('Trips', TripSchema, 'Trips');
