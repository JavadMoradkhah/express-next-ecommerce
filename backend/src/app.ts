require('dotenv').config();
import 'reflect-metadata';
import { createApp } from './bootstrap/app';
import { AppDataSource } from './config/database';
import { getRedisClient } from './config/redis';
import passport from 'passport';
import adminLocalStrategy from './auth/strategies/admin-local.strategy';
import * as adminController from './controllers/admins.controller';
import { SessionAdminUser } from './interfaces';

const app = createApp();
const port = parseInt(process.env.PORT, 10) ?? 5000;
const redisClient = getRedisClient();

passport.use('ADMIN_LOCAL_STRATEGY', adminLocalStrategy);

passport.serializeUser((user: any, cb: any) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id: string, cb) => {
  const admin = await adminController.findOne(id);

  const user: SessionAdminUser = {
    id: admin.id,
    username: admin.username,
    role: admin.role,
  };

  cb(null, user);
});

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
