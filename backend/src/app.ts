require('dotenv').config();
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppDataSource } from './config/database';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;

app.use(helmet());
app.use(express.json());

app.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World');
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
});
