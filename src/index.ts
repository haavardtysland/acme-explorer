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
import { FinderRoutes } from './api/routes/FinderRoutes';
import { SystemSettingsRoutes } from './api/routes/SystemSettingsRoutes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);

AuthRoutes(app);
ActorRoutes(app);
TripRoutes(app);
ApplicationRoutes(app);
FinderRoutes(app);
SystemSettingsRoutes(app);

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
