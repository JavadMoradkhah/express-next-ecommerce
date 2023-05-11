import { Router, Request, Response } from 'express';
import passport from 'passport';
import routeHandler from '../middleware/route-handler';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema as adminLoginSchema } from '../schemas/admin.schema';
import { createSchema, verificationSchema } from '../schemas/user.schema';
import { StatusCode } from '../enums/status-code.enum';
import { CreateUserDto } from '../dto';
import { loginAdmin, registerUser, verifyUser } from '../controllers/auth.controller';
import adminAuth from '../middleware/admin-auth';
import { sendVerificationEmail } from '../controllers/email-verifications.controller';

const router = Router();

router.post(
  '/admin/login',
  schemaValidator(adminLoginSchema),
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

router.post(
  '/signup',
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return registerUser(req.body as CreateUserDto, res);
  }, StatusCode.OK)
);

router.post(
  '/verify',
  schemaValidator(verificationSchema),
  routeHandler((req: Request, res: Response) => {
    return sendVerificationEmail(req.body.email);
  }, StatusCode.OK)
);

router.get(
  '/verify/:token',
  routeHandler((req: Request, res: Response) => {
    return verifyUser(req.params['token']);
  }, StatusCode.OK)
);

export default router;
