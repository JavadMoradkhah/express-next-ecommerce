require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import { getRedisClient } from './config/redis';
import middleware from './bootstrap/middleware';
import auth from './bootstrap/auth';
import appRouter from './routes/app.router';
import errorsMiddleware from './middleware/errors';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;
const redisClient = getRedisClient();

middleware(app, redisClient);
auth(app);

app.use(appRouter);
app.use(errorsMiddleware);

app.listen(port, async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection has been established successfully');
    await redisClient.connect();
    console.log('✅ Redis connection has been established successfully');
    console.log(`🟢 Server is running: http://localhost:${port}/api/`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

process.on('exit', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  console.log('Closing Redis connection...');
  await redisClient.disconnect();
});

process.on('SIGINT', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  console.log('Closing Redis connection...');
  await redisClient.disconnect();
  process.exit(0);
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled rejection:', err);
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  console.log('Closing Redis connection...');
  await redisClient.disconnect();
  process.exit(1);
});
