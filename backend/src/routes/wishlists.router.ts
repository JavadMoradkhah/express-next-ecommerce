import { Router, Request, Response } from 'express';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import auth from '../middleware/auth';
import { findAll, create, remove } from '../controllers/wishlists.controller';
import { CreateWishlistDto } from '../dto';
import { createSchema } from '../schemas/wishlist.schema';
import { SessionUser } from '../interfaces';
import { StatusCode } from '../enums/status-code.enum';

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
    return create(user.id, req.body as CreateWishlistDto);
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
