import express from 'express';
import { initMongoDBConnection } from './api/config/moongose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;

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
