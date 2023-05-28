import { Router, Request, Response } from 'express';
import admin from '../middleware/admin';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import routeHandler from '../middleware/route-handler';
import { CreateTagDto, UpdateTagDto } from '../dto';
import { createSchema, updateSchema } from '../schemas/tag.schema';
import { create, findAll, findOne, remove, update } from '../controllers/tags.controller';
import { StatusCode } from '../enums/status-code.enum';

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
    return create(req.body as CreateTagDto);
  })
);

router.patch(
  '/:id',
  admin(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateTagDto);
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
