import { JSONSchemaType } from 'ajv';

export type FinderType = {
  keyWord?: string;
  fromPrice?: string;
  toPrice?: string;
  fromDate?: string;
  toDate?: string;
};

export const finderValidator: JSONSchemaType<FinderType> = {
  type: 'object',
  properties: {
    keyWord: { type: 'string', nullable: true },
    fromPrice: { type: 'string', format: 'number', nullable: true },
    toPrice: { type: 'string', format: 'number', nullable: true },
    fromDate: { type: 'string', format: 'date', nullable: true },
    toDate: { type: 'string', format: 'date', nullable: true },
  },
  required: [],
};
