import { Router, Request, Response } from 'express';
import { create, findAll, findOne, remove, update } from '../controllers/products.controller';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { createSchema, updateSchema } from '../schemas/product.schema';
import admin from '../middleware/admin';
import { StatusCode } from '../enums/status-code.enum';
import { CreateProductDto, UpdateProductDto } from '../dto';

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
  admin(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return create(req.body as CreateProductDto);
  })
);

router.patch(
  '/:id',
  admin(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateProductDto);
  })
);

router.delete(
  '/:id',
  admin(),
  idValidator(),
  routeHandler(
    (req: Request, res: Response) => {
      return remove(req.params.id);
    },
    { statusCode: StatusCode.NO_CONTENT }
  )
);

export default router;
