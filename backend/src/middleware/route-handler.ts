import type { Request, Response, NextFunction } from 'express';
import type { RequestHandler, RequestHandlerOptions } from '../interfaces';
import { StatusCode } from '../enums/status-code.enum';

export default function (handler: RequestHandler, options?: RequestHandlerOptions) {
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
