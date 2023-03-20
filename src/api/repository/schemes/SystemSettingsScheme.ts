import mongoose from 'mongoose';
import { SystemSettings } from '../../models/SystemSettings';

const SystemSettingsSchema = new mongoose.Schema({
  name: { type: String },
  cachingTime: { type: Number },
  resultLimit: { type: Number },
});

export const SystemSettingsModel = mongoose.model<SystemSettings>(
  'SystemSettings',
  SystemSettingsSchema,
  'SystemSettings'
);
