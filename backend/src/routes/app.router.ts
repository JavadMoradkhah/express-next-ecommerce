import express, { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import notFoundMiddleware from '../middleware/not-found';
import authRouter from '../routes/auth.router';
import categoryRouter from '../routes/categories.router';
import colorRouter from '../routes/colors.router';
import countryRouter from '../routes/countries.router';
import sizeRouter from '../routes/sizes.router';
import shippingMethodRouter from '../routes/shipping-methods.router';
import uploadsRouter from '../routes/uploads.router';
import productsRouter from '../routes/products.router';
import productImagesRouter from '../routes/product-images.router';
import variationsRouter from '../routes/variations.router';
import reviewsRouter from '../routes/reviews.router';
import cartsRouter from '../routes/carts.router';

const router = Router();

router.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  Promise.reject(new Error('Oops!'));
  res.status(200).send('Hello World');
});

router.use('/api/auth', authRouter);
router.use('/api/categories', categoryRouter);
router.use('/api/colors', colorRouter);
router.use('/api/countries', countryRouter);
router.use('/api/shipping-methods', shippingMethodRouter);
router.use('/api/sizes', sizeRouter);
router.use('/api/uploads', uploadsRouter);
router.use('/api/products', productsRouter);
router.use('/api/product-images', productImagesRouter);
router.use('/api/variations', variationsRouter);
router.use('/api/reviews', reviewsRouter);
router.use('/api/carts', cartsRouter);

router.use(express.static(path.resolve(process.cwd(), 'public')));

router.use('*', notFoundMiddleware);

export default router;
