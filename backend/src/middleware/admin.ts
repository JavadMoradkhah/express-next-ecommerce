import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';
import { SessionAdminUser } from '../interfaces';
import { Role } from '../entities';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as SessionAdminUser;

    if (!req.isAuthenticated() || user?.role !== Role.SUPER_ADMIN) {
      return next(new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE));
    }

    next();
  };
};
