import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { BadRequestException } from '../common/exceptions';

export default (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(new BadRequestException(error.message));
    }

    next();
  };
};
