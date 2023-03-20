import mongoose from 'mongoose';
import { resourceLimits } from 'worker_threads';
import { SystemSettings } from '../../models/SystemSettings';

const SystemSettingsSchema = new mongoose.Schema({
  cachingTime: { type: Number },
  resourceLimits: { type: Number },
});

export const SystemSettingsModel = mongoose.model<SystemSettings>(
  'SystemSettings',
  SystemSettingsSchema,
  'SystemSettings'
);
