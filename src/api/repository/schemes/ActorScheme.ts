import mongoose from 'mongoose';
import { Actor } from '../../models/Actor';

const ActorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER'],
  },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  address: { type: String, required: false },
});

export const ActorModel = mongoose.model<Actor>(
  'Actors',
  ActorSchema,
  'Actors'
);
