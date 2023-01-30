import { JSONSchemaType } from 'ajv';
import { Actor } from '../../models/Actor';

export const actorValidator: JSONSchemaType<Actor> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    surename: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', nullable: true },
    adress: { type: 'string', nullable: true },
    role: { type: 'integer', enum: [0, 1, 2] },
    password: { type: 'string' },
  },
  required: ['name', 'surename', 'email', 'role', 'password'],
  additionalProperties: false,
};
