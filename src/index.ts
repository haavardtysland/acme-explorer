import express, { Application } from 'express';
import { initMongoDBConnection } from './api/config/moongose';
import dotenv from 'dotenv';
import { ActorRoutes } from './api/routes/ActorRoutes';
import bodyParser from 'body-parser';
import { TripRoutes } from './api/routes/TripRoutes';
import { AuthRoutes } from './api/routes/AuthRoutes';
import { ApplicationRoutes } from './api/routes/ApplicationRoutes';
import cookieParser from 'cookie-parser';
dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cookieParser());

AuthRoutes(app);
ActorRoutes(app);
TripRoutes(app);
ApplicationRoutes(app);

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
