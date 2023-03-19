import { JSONSchemaType } from 'ajv';
import { Actor, Role } from '../../models/Actor';
import { ActorFinder } from '../../models/ActorFinder';
import { UpdateActorDto } from '../../models/dtos/UpdateActorDto';

export const actorFinderValidator: JSONSchemaType<ActorFinder> = {
  type: 'object',
  properties: {
    keyWord: { type: 'string', nullable: true },
    fromPrice: { type: 'integer', nullable: true },
    toPrice: { type: 'integer', nullable: true },
    fromDate: { type: 'string', format: 'date', nullable: true },
    toDate: { type: 'string', format: 'date', nullable: true },
  },
};

export const actorValidator: JSONSchemaType<Actor> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    surname: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', nullable: true },
    address: { type: 'string', nullable: true },
    isBanned: { type: 'boolean' },
    role: {
      type: ['string'],
      enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER'] as Role[],
    },
    password: { type: 'string' },
    finder: actorFinderValidator,
  },
  required: ['name', 'surname', 'email', 'password', 'isBanned'],
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
