import {
  createErrorResponse,
  ErrorResponse,
} from '../error_handling/ErrorResponse';
import { SystemSettings } from '../models/SystemSettings';
import { SystemSettingsModel } from './schemes/SystemSettingsScheme';

const postSystemSettings = async (
  systemSettings: SystemSettings,
  name: string
): Promise<SystemSettings | ErrorResponse> => {
  try {
    const systemSettingsResponse = await SystemSettingsModel.updateOne(
      {name: name},
      {
        $set: {
          cachingTime: systemSettings.cachingTime,
          resultLimit: systemSettings.resultLimit,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    return createErrorResponse(error.message);
  }
  return systemSettings;
};

export const SystemSettingsRepository = { postSystemSettings };
