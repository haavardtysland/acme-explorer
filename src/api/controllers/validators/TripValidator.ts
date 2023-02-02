import { JSONSchemaType } from 'ajv';
import { Stage } from '../../models/Stage';
import { Trip } from '../../models/Trip';
import { TripStatus } from '../../models/TripStatus';
import { Status } from '../../models/TripStatus';

const tripStatusValidator: JSONSchemaType<TripStatus> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ACTIVE', 'CANCELLED'] as Status[] },
    description: { type: 'string' },
  },

  required: ['status', 'description'], //TODO check if it must be required
  additionalProperties: false,
};

const stageValidator: JSONSchemaType<Stage> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
  },

  required: ['title', 'description', 'price'], //TODO check if it must be required
  additionalProperties: false,
};

/* export const pictureValidator: JSONSchemaType<any> = {
    type: 'object',
    properties: {
      data: { type: 'string' },
      contentType: { type: 'string' },
    },
    required: ['data', 'contentType'],
    additionalProperties: false,
  }; */

export const tripValidator: JSONSchemaType<Trip> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    ticker: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    totalPrice: { type: 'integer' },
    startDate: { type: 'string', format: 'date' }, //finid way to do this with dates
    endDate: { type: 'string', format: 'date' },
    isPublished: { type: 'boolean' },
    status: tripStatusValidator,
    stages: { type: 'array', items: stageValidator },
    requirements: { type: 'array', items: { type: 'string' } },
    pictures: { type: 'array', items: { type: 'string' }, nullable: true }, //TODO find a way to safe this.
  },
  required: [
    'ticker',
    'title',
    'description',
    'startDate',
    'endDate',
    'isPublished',
    'stages',
    'status',
    'requirements',
  ],

  additionalProperties: false,
};
