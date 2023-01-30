import { JSONSchemaType } from 'ajv';
import { Actor } from '../../models/Actor';

export const actorValidator: JSONSchemaType<Actor> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    surename: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string', nullable: true },
    adress: { type: 'string', nullable: true },
    role: { type: 'integer' },
    password: { type: 'string' },
  },
  required: ['name', 'surename', 'email', 'role', 'password'],
  additionalProperties: false,
};
