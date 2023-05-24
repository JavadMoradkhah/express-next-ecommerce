import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../common/exceptions';
import { SessionAdminUser } from '../interfaces';
import { AdminRole } from '../enums/admin-role.enum';
import ErrorMessages from '../enums/error-messages.enum';

export default () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user as SessionAdminUser;

    if (!req.isAuthenticated() || user?.role !== AdminRole.SUPER_ADMIN) {
      return next(new ForbiddenException(ErrorMessages.FORBIDDEN_RESOURCE));
    }

    next();
  };
};
