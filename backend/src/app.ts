require('dotenv').config();
import 'reflect-metadata';
import passport from 'passport';
import { createApp } from './bootstrap/app';
import { AppDataSource } from './config/database';
import { getRedisClient } from './config/redis';
import * as adminLocalStrategy from './auth/strategies/admin-local.strategy';
import * as userLocalStrategy from './auth/strategies/user-local.strategy';
import * as adminController from './controllers/admins.controller';
import * as usersController from './controllers/users.controller';
import { SessionAdminUser, SessionUser } from './interfaces';
import { AdminRoles } from './entities';
import { CookieUser } from './interfaces/cookie-user';

const app = createApp();
const port = parseInt(process.env.PORT, 10) ?? 5000;
const redisClient = getRedisClient();

passport.use(adminLocalStrategy.name, adminLocalStrategy.strategy);
passport.use(userLocalStrategy.name, userLocalStrategy.strategy);

passport.serializeUser((user: any, cb: any) => {
  cb(null, {
    id: user.id,
    isAdmin: user?.role && AdminRoles.includes(user.role),
  });
});

passport.deserializeUser(async (cookieUser: CookieUser, cb) => {
  if (cookieUser.isAdmin) {
    const user = await adminController.findOne(cookieUser.id);

    const sessionAdminUser: SessionAdminUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return cb(null, sessionAdminUser);
  }

  const user = await usersController.findOne(cookieUser.id);

  const sessionUser: SessionUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  cb(null, sessionUser);
});

app.listen(port, async () => {
  try {
    await Promise.all([AppDataSource.initialize(), redisClient.connect()]);
    console.log('✅ Database connection has been established successfully');
    console.log('✅ Redis connection has been established successfully');
    console.log(`🟢 Server is running: http://localhost:${port}/api/`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
});

process.on('exit', () => {
  console.log('Closing TypeORM connection...');
  console.log('Closing Redis connection...');
  Promise.all([AppDataSource.destroy(), redisClient.disconnect()]).catch(console.log);
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
