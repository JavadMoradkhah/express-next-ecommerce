import { Router, Request, Response } from 'express';
import admin from '../middleware/admin';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import routeHandler from '../middleware/route-handler';
import { CreateProductTagDto } from '../dto';
import { createSchema } from '../schemas/product-tag.schema';
import { create, findAll, findOne, remove } from '../controllers/product-tags.controller';
import { StatusCode } from '../enums/status-code.enum';

const router = Router();

router.get(
  '/',
  admin(),
  routeHandler((req: Request, res: Response) => {
    return findAll();
  })
);

router.get(
  '/:id',
  admin(),
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
    return create(req.body as CreateProductTagDto);
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
