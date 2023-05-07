import { Router, Request, Response } from 'express';
import { create, findAll, findOne, remove, update } from '../controllers/products.controller';
import routeHandler from '../middleware/route-handler';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { StatusCode } from '../enums/status-code.enum';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { createSchema, updateSchema } from '../schemas/product.schema';
import adminAuth from '../middleware/admin-auth';

const router = Router();

router.get(
  '/',
  routeHandler((req: Request, res: Response) => {
    return findAll();
  })
);

router.get(
  '/:id',
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
    return create(req.body as CreateProductDto);
  })
);

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateProductDto);
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
