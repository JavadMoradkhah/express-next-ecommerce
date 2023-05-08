require('dotenv').config();
import 'reflect-metadata';
import * as path from 'path';
import fs from 'fs/promises';
import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppDataSource } from './config/database';
import authRouter from './routes/auth.router';
import categoryRouter from './routes/categories.router';
import colorRouter from './routes/colors.router';
import countryRouter from './routes/countries.router';
import sizeRouter from './routes/sizes.router';
import shippingMethodRouter from './routes/shipping-methods.router';
import uploadsRouter from './routes/uploads.router';
import productsRouter from './routes/products.router';
import productImagesRouter from './routes/product-images.router';
import adminLocalStrategy from './auth/strategies/admin-local.strategy';
import * as adminController from './controllers/admins.controller';
import { StatusCode } from './enums/status-code.enum';
import { HttpException } from './common/exceptions';
import { StatusCodeName } from './enums/status-code-name.enum';
import { getRedisClient } from './config/redis';
import { SessionAdminUser } from './interfaces';
import { MulterError } from 'multer';
import middleware from './bootstrap/middleware';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;
const redisClient = getRedisClient();

middleware(app, redisClient);
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World');
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/colors', colorRouter);
app.use('/api/countries', countryRouter);
app.use('/api/shipping-methods', shippingMethodRouter);
app.use('/api/sizes', sizeRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/products', productsRouter);
app.use('/api/product-images', productImagesRouter);

app.use('/public', express.static(path.resolve(process.cwd(), 'public')));

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
