import { Request, Response, NextFunction } from 'express';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export default function (handler: RequestHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
