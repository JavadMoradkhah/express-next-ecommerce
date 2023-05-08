import { Router, Request, Response } from 'express';
import { StatusCode } from '../enums/status-code.enum';
import { findOne, create, update, remove } from '../controllers/product-images.controller';
import { CreateProductImageDto, UpdateProductImageDto } from '../dto';
import { createSchema, updateSchema } from '../schemas/product-image.schema';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import adminAuth from '../middleware/admin-auth';
import routeHandler from '../middleware/route-handler';

const router = Router();

router.get(
  '/:id',
  adminAuth(),
  idValidator(),
  routeHandler((req: Request, res: Response) => {
    return findOne(req.params.id);
  })
);

router.post(
  '/',
  adminAuth(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return create(req.body as CreateProductImageDto);
  })
);

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateProductImageDto);
  })
);

router.delete(
  '/:id',
  adminAuth(),
  idValidator(),
  routeHandler((req: Request, res: Response) => {
    return remove(req.params.id);
  }, StatusCode.NO_CONTENT)
);

export default router;
