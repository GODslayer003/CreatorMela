import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

let mongod = null;

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    process.stdout.write('MongoDB connected\n');
  } catch (error) {
    if (env.NODE_ENV === 'production') {
      process.stderr.write(`MongoDB connection error: ${error.message}\n`);
      process.exit(1);
    }

    process.stdout.write('MongoDB not found, starting in-memory server...\n');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    process.stdout.write('In-memory MongoDB connected\n');
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
