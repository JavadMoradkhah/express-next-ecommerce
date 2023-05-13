import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/status-code.enum';

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

type Options = { statusCode?: StatusCode };

export default function (handler: RequestHandler, options?: Options) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = handler(req, res, next);

      const status = options?.statusCode
        ? options?.statusCode
        : req.method.toLowerCase() === 'post'
        ? StatusCode.CREATED
        : StatusCode.OK;

      if (result instanceof Promise) {
        return result.then((value) => res.status(status).send(value)).catch(next);
      }

      return res.status(status).send(result);
    } catch (err) {
      return next(err);
    }
  };
}
