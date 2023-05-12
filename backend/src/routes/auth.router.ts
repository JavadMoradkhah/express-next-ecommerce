import { Router, Request, Response } from 'express';
import passport from 'passport';
import * as adminLocalStrategy from '../auth/strategies/admin-local.strategy';
import * as userLocalStrategy from '../auth/strategies/user-local.strategy';
import routeHandler from '../middleware/route-handler';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema as adminLoginSchema } from '../schemas/admin.schema';
import { createSchema, loginSchema, verificationSchema } from '../schemas/user.schema';
import { loginAdmin, loginUser, registerUser, verifyUser } from '../controllers/auth.controller';
import adminAuth from '../middleware/admin-auth';
import { sendVerificationEmail } from '../controllers/email-verifications.controller';

const router = Router();

router.post(
  '/admin/login',
  schemaValidator(adminLoginSchema),
  passport.authenticate(adminLocalStrategy.name),
  routeHandler(loginAdmin)
);

router.post(
  '/login',
  schemaValidator(loginSchema),
  passport.authenticate(userLocalStrategy.name),
  routeHandler(loginUser)
);

router.get(
  '/admin/me',
  adminAuth(),
  routeHandler((req: Request, res: Response) => {
    return req.user;
  })
);

router.post('/signup', schemaValidator(createSchema), routeHandler(registerUser));

router.post('/verify', schemaValidator(verificationSchema), routeHandler(sendVerificationEmail));

router.get('/verify/:token', routeHandler(verifyUser));

export default router;
