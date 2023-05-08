require('dotenv').config();
import 'reflect-metadata';
import fs from 'fs/promises';
import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './config/database';
import { StatusCode } from './enums/status-code.enum';
import { HttpException } from './common/exceptions';
import { StatusCodeName } from './enums/status-code-name.enum';
import { getRedisClient } from './config/redis';
import { MulterError } from 'multer';
import middleware from './bootstrap/middleware';
import auth from './bootstrap/auth';
import appRouter from './routes/app.router';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;
const redisClient = getRedisClient();

middleware(app, redisClient);
auth(app);

app.use(appRouter);

app.use(async (error: any, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        message: StatusCodeName?.[500],
        error: StatusCodeName?.[500],
      });
    }
  }

  if (error instanceof MulterError) {
    return res.status(StatusCode.BAD_REQUEST).json({
      statusCode: StatusCode.BAD_REQUEST,
      message: error.message,
      error: StatusCodeName[400],
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name,
    });
  }

  console.error(error);

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: StatusCodeName?.[500],
    error: StatusCodeName?.[500],
  });
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
