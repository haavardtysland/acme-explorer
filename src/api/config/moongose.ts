import mongoose from 'mongoose';

const mongoDBOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set('strictQuery', false);

export const initMongoDBConnection = async () => {
  const mongoDBURI: string | undefined = process.env.CONNECTIONSTRING;
  if (!mongoDBURI) {
    throw new Error(
      'You need to provide the mongoDB conenction string as the environment variable CONNECTIONSTRING'
    );
  }
  console.log(mongoDBURI);
  await mongoose.connect(mongoDBURI, mongoDBOptions);
};
