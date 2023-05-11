import { Router, Request, Response } from 'express';
import passport from 'passport';
import routeHandler from '../middleware/route-handler';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema as adminLoginSchema } from '../schemas/admin.schema';
import { createSchema, verificationSchema } from '../schemas/user.schema';
import { loginAdmin, registerUser, verifyUser } from '../controllers/auth.controller';
import adminAuth from '../middleware/admin-auth';
import { sendVerificationEmail } from '../controllers/email-verifications.controller';

const router = Router();

router.post(
  '/admin/login',
  schemaValidator(adminLoginSchema),
  passport.authenticate('ADMIN_LOCAL_STRATEGY'),
  routeHandler(loginAdmin)
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
