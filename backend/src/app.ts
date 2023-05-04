require('dotenv').config();
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppDataSource } from './config/database';
import { StatusCode } from './enums/status-code.enum';
import { HttpException } from './common/exceptions';
import { StatusCodeName } from './enums/status-code-name.enum';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;

app.use(helmet());
app.use(express.json());

app.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World');
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name,
    });
  }

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
    console.log(`🟢 Server is running: http://localhost:${port}/api/`);
  } catch (error) {
    console.log(error);
  }
});

process.on('exit', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
});

process.on('SIGINT', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled rejection:', err);
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  process.exit(1);
});
