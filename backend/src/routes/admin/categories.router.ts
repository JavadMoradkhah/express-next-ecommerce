import { Router, Request, Response } from 'express';
import {
  create,
  findAll,
  findOne,
  remove,
  update,
} from '../../controllers/admin/categories.controller';
import routeHandler from '../../middleware/route-handler';
import idValidator from '../../middleware/id-validator';
import schemaValidator from '../../middleware/schema-validator';
import adminAuth from '../../middleware/auth';
import queryValidator from '../../middleware/query-validator';
import admin from '../../middleware/admin';
import { adminQuerySchema } from '../../schemas/admin-query.schema';
import { createSchema, updateSchema } from '../../schemas/category.schema';
import { CreateCategoryDto } from '../../dto';
import { StatusCode } from '../../enums/status-code.enum';

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
  adminAuth(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return create(req.body as CreateCategoryDto);
  })
);

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as CreateCategoryDto);
  })
);

router.delete(
  '/:id',
  adminAuth(),
  idValidator(),
  routeHandler(
    (req: Request, res: Response) => {
      return remove(req.params.id);
    },
    { statusCode: StatusCode.NO_CONTENT }
  )
);

export default router;
