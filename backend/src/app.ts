require('dotenv').config();
import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import * as adminLocalStrategy from './auth/strategies/admin-local.strategy';
import * as userLocalStrategy from './auth/strategies/user-local.strategy';
import * as adminController from './controllers/admins.controller';
import * as usersController from './controllers/users.controller';
import { SessionAdminUser, SessionUser } from './interfaces';
import { AppDataSource } from './config/database';
import { getRedisClient } from './config/redis';
import { AdminRoles } from './entities';
import { CookieUser } from './interfaces/cookie-user';
import sessionOptions from './config/session-options';
import appRouter from './routes/app.router';
import errorsMiddleware from './middleware/errors';
import { logger } from './config/logger';
import './workers/email-worker';

const app = express();
const redisClient = getRedisClient();

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionOptions(redisClient)));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());
app.use(appRouter);
app.use(errorsMiddleware);

const port = parseInt(process.env.PORT, 10) ?? 5000;

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
  } catch (error: any) {
    logger.error(error.message, error);
    process.exit(1);
  }
});

process.on('exit', () => {
  console.log('Closing TypeORM connection...');
  console.log('Closing Redis connection...');
  Promise.all([AppDataSource.destroy(), redisClient.disconnect()]).catch((error) =>
    logger.error(error.message, error)
  );
});

process.on('SIGINT', async () => {
  process.exit(0);
});

process.on('unhandledRejection', (err: any) => {
  logger.error(err.message, err);
  process.exit(1);
});
