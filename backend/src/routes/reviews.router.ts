import { Router, Request, Response } from 'express';
import { create, findAll, remove, update } from '../controllers/reviews.controller';
import routeHandler from '../middleware/route-handler';
import auth from '../middleware/auth';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { createSchema, updateSchema } from '../schemas/review.schema';
import { StatusCode } from '../enums/status-code.enum';
import { CreateReviewDto, UpdateReviewDto } from '../dto';
import { SessionUser } from '../interfaces';

const router = Router();

router.use(auth());

router.get(
  '/',
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return findAll(user.id);
  })
);

router.post(
  '/',
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return create(user.id, req.body as CreateReviewDto);
  })
);

router.patch(
  '/:id',
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    const user = req.user as SessionUser;
    return update(req.params.id, user.id, req.body as UpdateReviewDto);
  })
);

router.delete(
  '/:id',
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
