import { JSONSchemaType } from 'ajv';
import { Picture } from '../../models/Picture';
import { Stage } from '../../models/Stage';
import { Trip } from '../../models/Trip';
import { TripStatus, TStatus } from '../../models/TripStatus';
import { applicationValidator } from './ApplicationValidator';

const tripStatusValidator: JSONSchemaType<TripStatus> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['ACTIVE', 'CANCELLED'] as TStatus[] },
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

const pictureValidator: JSONSchemaType<Picture> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    fileId: { type: 'string' },
  },

  required: ['name', 'fileId'], //TODO check if it must be required
  additionalProperties: false,
};

export const tripValidator: JSONSchemaType<Trip> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    managerId: { type: 'string' },
    ticker: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    totalPrice: { type: 'integer' },
    startDate: { type: 'string', format: 'date' },
    endDate: { type: 'string', format: 'date' },
    isPublished: { type: 'boolean' },
    status: tripStatusValidator,
    stages: { type: 'array', items: stageValidator },
    requirements: { type: 'array', items: { type: 'string' } },
    pictures: { type: 'array', items: { type: 'string' }, nullable: true },
    applications: { type: 'array', items: applicationValidator },
  },
  required: [
    'ticker',
    'managerId',
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
