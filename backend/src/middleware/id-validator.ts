import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.string().uuid().validate(req.params.id);

    if (error) {
      return next(new BadRequestException(ErrorMessages.INVALID_ID));
    }

    next();
  };
};
