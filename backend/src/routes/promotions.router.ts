import { Router, Request, Response } from 'express';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import admin from '../middleware/admin';
import { create, findAll, findOne, remove, update } from '../controllers/promotions.controller';
import { CreatePromotionDto, UpdatePromotionDto } from '../dto';
import { createSchema, updateSchema } from '../schemas/promotion.schema';
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
    return create(req.body as CreatePromotionDto);
  })
);

router.put(
  '/:id',
  admin(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdatePromotionDto);
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
