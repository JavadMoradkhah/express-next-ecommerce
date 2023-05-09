import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../common/exceptions';
import { Role } from '../entities';
import ErrorMessages from '../enums/error-messages.enum';
import { SessionAdminUser } from '../interfaces';

export default (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as SessionAdminUser;

    if (!req.isAuthenticated() || !roles.includes(user?.role)) {
      return next(new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE));
    }

    next();
  };
};
