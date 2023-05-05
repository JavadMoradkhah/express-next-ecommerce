import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/status-code.enum';
import { StatusCodeName } from '../enums/status-code-name.enum';

type RequestHandler = (req: Request, res: Response) => Promise<any>;

export default function (handler: RequestHandler, statusCode?: StatusCode) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req, res);

      const status = statusCode
        ? statusCode
        : req.method.toLowerCase() === 'post'
        ? StatusCode.CREATED
        : StatusCode.OK;

      res.status(status).send({
        statusCode: status,
        data: response,
        ...(status !== StatusCode.OK &&
          status !== StatusCode.CREATED && { message: StatusCodeName?.[status] }),
      });
    } catch (err) {
      next(err);
    }
  };
}
