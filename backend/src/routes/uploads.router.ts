import { Router } from 'express';
import routeHandler from '../middleware/route-handler';
import { findAll, findOne, create, update, remove } from '../controllers/uploads.controller';
import { createSchema, updateSchema } from '../schemas/upload.schema';
import schemaValidator from '../middleware/schema-validator';
import upload from '../middleware/upload';
import adminAuth from '../middleware/admin-auth';
import idValidator from '../middleware/id-validator';

const router = Router();

router.get('/', adminAuth(), routeHandler(findAll));

router.get('/:id', adminAuth(), idValidator(), routeHandler(findOne));

router.post(
  '/',
  adminAuth(),
  upload.single('file'),
  schemaValidator(createSchema),
  routeHandler(create)
);

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler(update)
);

router.delete('/:id', adminAuth(), idValidator(), routeHandler(remove));

export default router;
