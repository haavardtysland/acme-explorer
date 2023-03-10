import { JSONSchemaType } from 'ajv';
import { Actor, Role } from '../../models/Actor';

export const actorValidator: JSONSchemaType<Actor> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    role: {
      type: ['string'],
      enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER'] as Role[],
    },
    password: { type: 'string' },
  },
  required: ['name', 'surname', 'email', 'password'],
  additionalProperties: false,
};