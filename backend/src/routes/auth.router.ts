import { Router, Request, Response } from 'express';
import passport from 'passport';
import * as adminLocalStrategy from '../auth/strategies/admin-local.strategy';
import * as userLocalStrategy from '../auth/strategies/user-local.strategy';
import routeHandler from '../middleware/route-handler';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema as adminLoginSchema } from '../schemas/admin.schema';
import { createSchema, loginSchema, verificationSchema } from '../schemas/user.schema';
import { loginAdmin, loginUser, registerUser, verifyUser } from '../controllers/auth.controller';
import adminAuth from '../middleware/auth';
import { sendVerificationEmail } from '../controllers/email-verifications.controller';
import { CreateUserDto, VerificationDto } from '../dto';
import { StatusCode } from '../enums/status-code.enum';

const router = Router();

router.post(
  '/admin/login',
  schemaValidator(adminLoginSchema),
  passport.authenticate(adminLocalStrategy.name),
  routeHandler(
    (req: Request, res: Response) => {
      return loginAdmin(req);
    },
    { statusCode: StatusCode.OK }
  )
);

router.post(
  '/login',
  schemaValidator(loginSchema),
  passport.authenticate(userLocalStrategy.name),
  routeHandler(
    (req: Request, res: Response) => {
      return loginUser(req);
    },
    { statusCode: StatusCode.OK }
  )
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
    return registerUser(req.body as CreateUserDto);
  })
);

router.post(
  '/verify',
  schemaValidator(verificationSchema),
  routeHandler(
    (req: Request, res: Response) => {
      return sendVerificationEmail(req.body as VerificationDto);
    },
    { statusCode: StatusCode.OK }
  )
);

router.get(
  '/verify/:token',
  routeHandler((req: Request, res: Response) => {
    return verifyUser(req.params['token']);
  })
);

export default router;
