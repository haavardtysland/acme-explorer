import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { hash } from 'bcryptjs';

const mongoDBOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set('strictQuery', false);

export const initMongoDBConnection = async () => {
  const isTestEnvironment = process.env.NODE_ENV?.trim() === 'test';
  const mongoDBURI: string | undefined = process.env.CONNECTIONSTRING;
  if (isTestEnvironment) {
    let mongoServer: MongoMemoryServer;

    before(async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, mongoDBOptions);
      const startActor = {
        name: 'Admin6Name',
        surname: 'Admin6Surname',
        email: 'Admin@admin.com',
        role: 'ADMINISTRATOR',
        password:
          '$2a$08$90UNLAiPxSjXM6CZamapAufPPmNMQxaK7moVZzk4F09HAlYwjPhA6',
        phone: '+34612345679',
        address: 'myAddress',
      };
      const actorSchema = new mongoose.Schema(
        {
          name: String,
          surname: String,
          email: String,
          password: String,
          role: String,
          phone: String,
          adress: String,
        },
        { collection: 'Actors' }
      );
      const ActorModel = mongoose.model('Actor', actorSchema);
      await new Promise((resolve, reject) => {
        ActorModel.create(startActor, (err, actor) => {
          if (err) {
            reject(err);
          } else {
            console.log(actor + '\n-- actor inserted successfully');
            resolve(actor);
          }
        });
      });
    });

    after(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
    });
  } else {
    if (!mongoDBURI) {
      throw new Error(
        'You need to provide the mongoDB conenction string as the environment variable CONNECTIONSTRING'
      );
    }
    await mongoose.connect(mongoDBURI, mongoDBOptions);
  }
};
