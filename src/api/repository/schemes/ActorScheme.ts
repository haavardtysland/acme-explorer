import mongoose from 'mongoose';
import { Actor } from '../../models/Actor';

const ActorSchema = new mongoose.Schema<Actor>({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER'],
  },
  cacheDuration: { type: Number, required: false, min: 1, max: 24 },
  numTripsFromFinder: { type: Number, required: false, min: 1, max: 100 },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: String, required: false },
  isBanned: { type: Boolean, required: true },
  finder: {
    keyWord: { type: String, required: false },
    fromPrice: { type: Number, required: false },
    toPrice: { type: Number, required: false },
    fromDate: { type: Date, required: false },
    toDate: { type: Date, required: false },
  },
});

export const ActorModel = mongoose.model<Actor>(
  'Actors',
  ActorSchema,
  'Actors'
);
