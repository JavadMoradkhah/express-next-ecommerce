import { Request, Response, NextFunction } from 'express';
import routeHandler from './route-handler';
import { NotFoundException } from '../common/exceptions';

export default routeHandler((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundException(`Cannot ${req.method} ${req.originalUrl}`);
});
