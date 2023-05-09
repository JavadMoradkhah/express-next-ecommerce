import express, { Express } from 'express';
import passport from 'passport';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import sessionOptions from '../config/session-options';
import appRouter from '../routes/app.router';
import { getRedisClient } from '../config/redis';
import errorsMiddleware from '../middleware/errors';

let app = null;

export const createApp = (): Express => {
  if (app !== null) {
    throw new Error(
      'An instance of the application has already been created!'
    );
  }

  app = express();

  const redisClient = getRedisClient();

  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session(sessionOptions(redisClient)));
  app.use(cookieParser());

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(appRouter);
  app.use(errorsMiddleware);

  return app;
};

export const getApp = (): Express => {
  if (!app) {
    throw new Error(
      'An instance of the application has not been created, please make sure that you called the "createApp()" function to create an instance of the express application'
    );
  }

  return app;
};
