import { Router } from 'express';
import brandsRouter from './brands.router';
import reviewsRouter from './reviews.router';

const router = Router();

router.use('/admin/brands', brandsRouter);
router.use('/admin/reviews', reviewsRouter);

export default router;
