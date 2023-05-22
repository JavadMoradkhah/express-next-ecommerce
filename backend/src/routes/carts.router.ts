import { Router, Request, Response } from 'express';
import { create, findAll, remove, update } from '../controllers/carts.controller';
import { createSchema, updateSchema } from '../schemas/cart.schema';
import { CreateCartDto, UpdateCartDto } from '../dto';
import { SessionUser } from '../interfaces';
import { StatusCode } from '../enums/status-code.enum';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import auth from '../middleware/auth';

const router = Router();

router.get(
  '/',
  auth(),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return findAll(user.id);
  })
);

router.post(
  '/',
  auth(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return create(user.id, req.body as CreateCartDto);
  })
);

router.patch(
  '/:id',
  auth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return update(req.params.id, user.id, req.body as UpdateCartDto);
  })
);

router.delete(
  '/:id',
  auth(),
  idValidator(),
  routeHandler(
    (req: Request, res: Response) => {
      const user = req.user as SessionUser;
      return remove(req.params.id, user.id);
    },
    { statusCode: StatusCode.NO_CONTENT }
  )
);

export default router;
