import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { TripRoutes } from './api/routes/TripRoutes';

import swaggerDocs from '../swagger';
import { initMongoDBConnection } from './api/config/moongose';
import { ActorRoutes } from './api/routes/ActorRoutes';
import { AuthRoutes } from './api/routes/AuthRoutes';
import { ApplicationRoutes } from './api/routes/ApplicationRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: '*',
  })
);

AuthRoutes(app);
ActorRoutes(app);
TripRoutes(app);
ApplicationRoutes(app);

(async () => {
  try {
    await initMongoDBConnection();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      swaggerDocs(app);
    });
  } catch (error) {
    console.log(error.message);
  }
})();
