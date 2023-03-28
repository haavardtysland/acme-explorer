import { JSONSchemaType } from 'ajv';
import { Application } from '../../models/Application';
import { ApplicationStatus, AStatus } from '../../models/ApplicationStatus';

export const applicationStatusValidator: JSONSchemaType<ApplicationStatus> = {
  type: 'object',
  properties: {
    status: {
      type: ['string'],
      enum: [
        'PENDING',
        'REJECTED',
        'DUE',
        'ACCEPTED',
        'CANCELLED',
      ] as AStatus[],
    },
    description: { type: 'string' },
  },

  required: ['status', 'description'], //TODO check if it must be required
  additionalProperties: false,
};

export const applicationValidator: JSONSchemaType<Application> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    explorerId: { type: 'string' },
    comments: { type: 'array', items: { type: 'string' } },
    status: applicationStatusValidator,
    dateCreated: { type: 'string', format: 'date' },
    tripId: { type: 'string' },
  },
  required: ['explorerId', 'status', 'dateCreated', 'tripId'],
  additionalProperties: false,
};
