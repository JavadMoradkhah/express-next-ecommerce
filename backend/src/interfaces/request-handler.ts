import type { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/status-code.enum';

export interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): any;
}

export interface RequestHandlerOptions {
  statusCode?: StatusCode;
}
