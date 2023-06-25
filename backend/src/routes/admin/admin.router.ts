import { Router } from 'express';
import brandsRouter from './brands.router';
import reviewsRouter from './reviews.router';
import categoriesRouter from './categories.router';

const router = Router();

router.use('/admin/brands', brandsRouter);
router.use('/admin/reviews', reviewsRouter);
router.use('/admin/categories', categoriesRouter);

export default router;
