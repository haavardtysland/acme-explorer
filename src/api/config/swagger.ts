import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT;
console.log(port);

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Acme Explorer',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
