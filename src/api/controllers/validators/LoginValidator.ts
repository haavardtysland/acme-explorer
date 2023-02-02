import { JSONSchemaType } from 'ajv';
import { LoginRequest } from '../../auth/auth';

export const loginValidator: JSONSchemaType<LoginRequest> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};
