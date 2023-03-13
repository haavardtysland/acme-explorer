import { JSONSchemaType } from 'ajv';
import { addAbortSignal } from 'stream';
import { Actor, Role } from '../../models/Actor';
import { ActorFinder } from '../../models/ActorFinder';
import { finderValidator } from './FinderValidator';

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
    role: {
      type: ['string'],
      enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER'] as Role[],
    },
    password: { type: 'string' },
    finder: actorFinderValidator,
  },
  required: ['name', 'surname', 'email', 'password'],
  additionalProperties: false,
};
