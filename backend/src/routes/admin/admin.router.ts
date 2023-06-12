import { Router } from 'express';
import brandsRouter from '../admin/brands.router';

const router = Router();

router.use('/admin/brands', brandsRouter);

export default router;
