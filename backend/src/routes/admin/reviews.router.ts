import { Router, Request, Response } from 'express';
import { findAll, findOne, remove, updateStatus } from '../../controllers/admin/reviews.controller';
import admin from '../../middleware/admin';
import routeHandler from '../../middleware/route-handler';
import idValidator from '../../middleware/id-validator';
import queryValidator from '../../middleware/query-validator';
import schemaValidator from '../../middleware/schema-validator';
import { adminQuerySchema } from '../../schemas/admin-query.schema';
import { updateStatusSchema } from '../../schemas/review.schema';
import { StatusCode } from '../../enums/status-code.enum';
import { UpdateReviewStatusDto } from '../../dto';

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

router.patch(
  '/:id/status',
  idValidator(),
  schemaValidator(updateStatusSchema),
  routeHandler((req: Request, res: Response) => {
    return updateStatus(req.params.id, req.body as UpdateReviewStatusDto);
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
