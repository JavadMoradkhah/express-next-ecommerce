import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../common/exceptions';
import { Role } from '../entities';
import { SessionAdminUser } from '../interfaces';
import ErrorMessages from '../enums/error-messages.enum';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as SessionAdminUser;

    if (!req.isAuthenticated() || user?.role !== Role.SUPER_ADMIN) {
      return next(new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE));
    }

    next();
  };
};
