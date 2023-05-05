import { Router, Request, Response } from 'express';
import routeHandler from '../middleware/route-handler';
import { StatusCode } from '../enums/status-code.enum';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema } from '../schemas/admin.schema';
import passport from 'passport';
import { loginAdmin } from '../controllers/auth.controller';
import adminAuth from '../middleware/admin-auth';

const router = Router();

router.post(
  '/admin/login',
  schemaValidator(loginSchema),
  passport.authenticate('ADMIN_LOCAL_STRATEGY'),
  routeHandler((req: Request, res: Response) => {
    return loginAdmin(req);
  }, StatusCode.OK)
);

router.get(
  '/admin/me',
  adminAuth(),
  routeHandler((req: Request, res: Response) => {
    return req.user;
  })
);

export default router;
