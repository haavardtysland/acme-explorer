import { SystemSettings } from '../models/SystemSettings';
import { systemSettingsValidator } from './validators/SystemSettingsVallidator';
import { Request, Response } from 'express';
import Validator from './validators/Validator';
import {
  ErrorResponse,
  isErrorResponse,
} from '../error_handling/ErrorResponse';
import { SystemSettingsRepository } from '../repository/SystemSettingsRepository';

export const postSystemSettings = async (req: Request, res: Response) => {
  const systemSettings: SystemSettings = req.body;
  const validate = Validator.compile<SystemSettings>(systemSettingsValidator);

  if (!validate(systemSettings)) {
    return res.status(400).send(validate.errors);
  }
  
  const name = 'systemSettings';

  const response: SystemSettings | ErrorResponse =
    await SystemSettingsRepository.postSystemSettings(systemSettings, name);
  if (isErrorResponse(response)) {
    return res.status(400).send(response.errorMessage);
  }
  return res.send(response);
};
