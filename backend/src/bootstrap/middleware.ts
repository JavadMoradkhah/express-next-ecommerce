import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import sessionOptions from '../config/session-options';
import { RedisClientType } from 'redis';

export default function (app: Express, redisClient: RedisClientType) {
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session(sessionOptions(redisClient)));
  app.use(cookieParser());
}
