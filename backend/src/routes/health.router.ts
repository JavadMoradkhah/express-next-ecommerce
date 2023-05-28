import { Request, Response, NextFunction } from 'express';
import routeHandler from '../middleware/route-handler';

export default routeHandler((req: Request, res: Response, next: NextFunction) => {
  return 'OK';
});
