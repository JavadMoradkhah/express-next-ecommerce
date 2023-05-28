import { AdminRoles } from '../../entities';
import { CookieUser } from '../../interfaces/cookie-user';
import { SessionAdminUser, SessionUser } from '../../interfaces';
import * as adminController from '../../controllers/admins.controller';
import * as usersController from '../../controllers/users.controller';

export const serializer = (user: any, cb: any) => {
  cb(null, {
    id: user.id,
    isAdmin: user?.role && AdminRoles.includes(user.role),
  });
};

export const deserializer = async (cookieUser: CookieUser, cb) => {
  if (cookieUser.isAdmin) {
    const user = await adminController.findOne(cookieUser.id);

    const sessionAdminUser: SessionAdminUser = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return cb(null, sessionAdminUser);
  }

  const user = await usersController.findOne(cookieUser.id);

  const sessionUser: SessionUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  cb(null, sessionUser);
};
