import express from 'express';
import { initMongoDBConnection } from './config/moongose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

(async () => {
  try {
    await initMongoDBConnection();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
