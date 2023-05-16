import { Router, Request, Response } from 'express';
import {
  create,
  findAll,
  findUserReviews,
  findOne,
  remove,
  update,
  updateStatus,
} from '../controllers/reviews.controller';
import routeHandler from '../middleware/route-handler';
import admin from '../middleware/admin';
import auth from '../middleware/auth';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { createSchema, updateSchema, updateStatusSchema } from '../schemas/review.schema';
import { StatusCode } from '../enums/status-code.enum';
import { CreateReviewDto, UpdateReviewDto, UpdateReviewStatusDto } from '../dto';
import { SessionUser } from '../interfaces';

const router = Router();

router.get(
  '/',
  admin(),
  routeHandler((req: Request, res: Response) => {
    return findAll();
  })
);

router.get(
  '/mine',
  auth(),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return findUserReviews(user.id);
  })
);

router.get(
  '/:id',
  admin(),
  idValidator(),
  routeHandler((req: Request, res: Response) => {
    return findOne(req.params.id, { includeRelations: true });
  })
);

router.post(
  '/',
  auth(),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return create(user.id, req.body as CreateReviewDto);
  })
);

router.patch(
  '/:id',
  auth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return update(req.params.id, user.id, req.body as UpdateReviewDto);
  })
);

router.patch(
  '/:id/status',
  admin(),
  idValidator(),
  schemaValidator(updateStatusSchema),
  routeHandler((req: Request, res: Response) => {
    return updateStatus(req.params.id, req.body as UpdateReviewStatusDto);
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
