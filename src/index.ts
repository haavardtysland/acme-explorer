import express, { Application } from 'express';
import { initMongoDBConnection } from './api/config/moongose';
import dotenv from 'dotenv';
import { ActorRoutes } from './api/routes/ActorRoutes';
import bodyParser from 'body-parser';
import { TripRoutes } from './api/routes/TripRoutes';
dotenv.config();

const app: Application = express();
const port = process.env.PORT;
app.use(bodyParser.json());

ActorRoutes(app);
TripRoutes(app);

app.get('/swagger-test', (req, res) => {
  res.send('jaha');
});

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
