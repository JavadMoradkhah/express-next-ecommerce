import { Router, Request, Response } from 'express';
import routeHandler from '../middleware/route-handler';
import { findAll, findOne, create, update, remove } from '../controllers/uploads.controller';
import { createSchema, updateSchema } from '../schemas/upload.schema';
import schemaValidator from '../middleware/schema-validator';
import upload from '../middleware/upload';
import adminAuth from '../middleware/auth';
import idValidator from '../middleware/id-validator';
import { StatusCode } from '../enums/status-code.enum';
import { CreateUploadDto, UpdateUploadDto } from '../dto';

const router = Router();

router.get(
  '/',
  adminAuth(),
  routeHandler((req: Request, res: Response) => {
    return findAll();
  })
);

router.get(
  '/:id',
  adminAuth(),
  idValidator(),
  routeHandler((req: Request, res: Response) => {
    return findOne(req.params.id);
  })
);

router.post(
  '/',
  adminAuth(),
  upload.single('file'),
  schemaValidator(createSchema),
  routeHandler((req: Request, res: Response) => {
    return create(req, req.body as CreateUploadDto);
  })
);

router.patch(
  '/:id',
  adminAuth(),
  idValidator(),
  schemaValidator(updateSchema),
  routeHandler((req: Request, res: Response) => {
    return update(req.params.id, req.body as UpdateUploadDto);
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
