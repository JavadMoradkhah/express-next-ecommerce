import { Request, Response, NextFunction } from 'express';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default function (handler: RequestHandler): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };
}
