import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export default () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next(new UnauthorizedException(ErrorMessages.LOGIN_REQUIRED));
    }

    next();
  };
};
