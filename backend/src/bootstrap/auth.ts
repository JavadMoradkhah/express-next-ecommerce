import { Express } from 'express';
import passport from 'passport';
import * as adminController from '../controllers/admins.controller';
import adminLocalStrategy from '../auth/strategies/admin-local.strategy';
import { SessionAdminUser } from '../interfaces';

export default function (app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('ADMIN_LOCAL_STRATEGY', adminLocalStrategy);

  passport.serializeUser((user: any, cb: any) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id: string, cb) => {
    const admin = await adminController.findOne(id);

    const user: SessionAdminUser = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };

    cb(null, user);
  });
}
