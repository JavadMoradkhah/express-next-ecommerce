import { Router } from 'express';
import { findOne, create, update, remove } from '../controllers/product-images.controller';
import { createSchema, updateSchema } from '../schemas/product-image.schema';
import idValidator from '../middleware/id-validator';
import schemaValidator from '../middleware/schema-validator';
import adminAuth from '../middleware/admin-auth';
import routeHandler from '../middleware/route-handler';

const router = Router();

router.get('/:id', adminAuth(), idValidator(), routeHandler(findOne));

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
