import { Router } from 'express';
import { create, findAll, findOne, remove, update } from '../controllers/categories.controller';
import routeHandler from '../middleware/route-handler';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import { createSchema, updateSchema } from '../schemas/category.schema';
import adminAuth from '../middleware/admin-auth';

const router = Router();

router.get('/', routeHandler(findAll));

router.get('/:id', idValidator(), routeHandler(findOne));

router.post('/', adminAuth(), schemaValidator(createSchema), routeHandler(create));

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler(update)
);

router.delete('/:id', adminAuth(), idValidator(), routeHandler(remove));

export default router;
