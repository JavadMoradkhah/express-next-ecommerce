import { Router, Request, Response } from 'express';
import passport from 'passport';
import routeHandler from '../middleware/route-handler';
import schemaValidator from '../middleware/schema-validator';
import { loginSchema as adminLoginSchema } from '../schemas/admin.schema';
import { createSchema } from '../schemas/user.schema';
import { StatusCode } from '../enums/status-code.enum';
import { CreateUserDto } from '../dto';
import { loginAdmin, registerUser } from '../controllers/auth.controller';
import adminAuth from '../middleware/admin-auth';

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

export default router;
