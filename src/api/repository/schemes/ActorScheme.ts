import mongoose from 'mongoose';
import { Actor } from '../../models/Actor';

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surename: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: Number, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  adress: { type: String, required: false },
});

export const ActorModel = mongoose.model<Actor>(
  'Actors',
  ActorSchema,
  'Actors'
);
