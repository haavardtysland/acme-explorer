import { JSONSchemaType } from 'ajv';
import { Actor, Role } from '../../models/Actor';
import { UpdateActorDto } from '../../models/dtos/UpdateActorDto';

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

export const updateActorValidator: JSONSchemaType<UpdateActorDto> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    password: { type: 'string' },
  },
  required: [],
  additionalProperties: false,
};
