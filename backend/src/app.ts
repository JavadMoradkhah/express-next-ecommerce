require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = parseInt(process.env.PORT, 10) ?? 5000;

app.use(express.json());

app.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is running: http://localhost:${port}/api/`);
});
