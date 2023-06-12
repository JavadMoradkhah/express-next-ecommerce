import { Router, Request, Response } from 'express';

import idValidator from '../../middleware/id-validator';
import schemaValidator from '../../middleware/schema-validator';
import routeHandler from '../../middleware/route-handler';
import { CreateBrandDto, UpdateBrandDto } from '../../dto';
import { createSchema, updateSchema } from '../../schemas/brand.schema';
import {
  create,
  findAll,
  findOne,
  remove,
  update,
} from '../../controllers/admin/brands.controller';
import { StatusCode } from '../../enums/status-code.enum';
import admin from '../../middleware/admin';
import queryValidator from '../../middleware/query-validator';
import { adminQuerySchema } from '../../schemas/admin-query.schema';

const router = Router();

router.use(admin());

router.get(
  '/',
  queryValidator(adminQuerySchema),
  routeHandler((req: Request, res: Response) => {
    return findAll(req.query);
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
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return create(req.body as CreateBrandDto);
  })
);

router.patch(
  '/:id',
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateBrandDto);
  })
);

router.delete(
  '/:id',
  idValidator(),
  routeHandler(
    (req: Request, res: Response) => {
      return remove(req.params.id);
    },
    { statusCode: StatusCode.NO_CONTENT }
  )
);

export default router;
