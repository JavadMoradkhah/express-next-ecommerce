import { Router, Request, Response } from 'express';
import { findAll, findOne } from '../controllers/categories.controller';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';

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

export default router;
