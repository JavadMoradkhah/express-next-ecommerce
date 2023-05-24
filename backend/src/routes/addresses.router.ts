import { Router, Request, Response, NextFunction } from 'express';
import routeHandler from '../middleware/route-handler';
import auth from '../middleware/auth';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { SessionUser } from '../interfaces';
import { CreateAddressDto, UpdateAddressDto } from '../dto';
import { findAll, findOne, create, update, remove } from '../controllers/addresses.controller';
import { createSchema, updateSchema } from '../schemas/address.schema';
import { StatusCode } from '../enums/status-code.enum';

const router = Router();

router.get(
  '/',
  auth(),
  routeHandler((req: Request, res: Response, next: NextFunction) => {
    const user = req.user as SessionUser;
    return findAll(user.id);
  })
);

router.get(
  '/:id',
  auth(),
  idValidator(),
  routeHandler((req: Request, res: Response, next: NextFunction) => {
    const user = req.user as SessionUser;
    return findOne(user.id, user.id);
  })
);

router.post(
  '/',
  auth(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response, next: NextFunction) => {
    const user = req.user as SessionUser;
    return create(user.id, req.body as CreateAddressDto);
  })
);

router.patch(
  '/:id',
  auth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response, next: NextFunction) => {
    const user = req.user as SessionUser;
    return update(req.params.id, user.id, req.body as UpdateAddressDto);
  })
);

router.delete(
  '/:id',
  auth(),
  idValidator(),
  routeHandler(
    (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as SessionUser;
      return remove(req.params.id, user.id);
    },
    { statusCode: StatusCode.NO_CONTENT }
  )
);

export default router;
