require('dotenv').config();
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;

app.use(helmet());
app.use(express.json());

app.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}/api/`);
});
