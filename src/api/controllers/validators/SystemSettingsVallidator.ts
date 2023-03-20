import { JSONSchemaType } from 'ajv';
import { SystemSettings } from '../../models/SystemSettings';

export const systemSettingsValidator: JSONSchemaType<SystemSettings> = {
  type: 'object',
  properties: {
    cachingTime: { type: 'integer', minimum: 3600, maximum: 86400 },
    resultLimit: { type: 'integer', minimum: 10, maximum: 100 },
  },
  required: [],
  additionalProperties: false,
};
