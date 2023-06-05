import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export default (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.query)) {
    const { error } = schema.validate(req.query);

    if (error) {
      req.query = {};
    }
  }

  next();
};
