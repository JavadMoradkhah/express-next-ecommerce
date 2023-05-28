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
import { AppDataSource } from './config/database';
import { getRedisClient } from './config/redis';
import { logger } from './config/logger';
import { serializer, deserializer } from './auth/serializers/passport';
import sessionOptions from './config/session-options';
import appRouter from './routes/app.router';
import errorsMiddleware from './middleware/errors';
import './workers/email-worker';

const app = express();
const redisClient = getRedisClient();
const port = parseInt(process.env.PORT, 10) ?? 5000;

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

passport.use(adminLocalStrategy.name, adminLocalStrategy.strategy);
passport.use(userLocalStrategy.name, userLocalStrategy.strategy);

passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

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

process.on('uncaughtException', (err: any) => {
  logger.error(err.message, err);
  process.exit(1);
});
