import express, { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import notFoundMiddleware from '../middleware/not-found';
import healthRouter from './health.router';
import authRouter from './auth.router';
import categoryRouter from './categories.router';
import colorRouter from './colors.router';
import countryRouter from './countries.router';
import sizeRouter from './sizes.router';
import shippingMethodRouter from './shipping-methods.router';
import uploadsRouter from './uploads.router';
import productsRouter from './products.router';
import productImagesRouter from './product-images.router';
import variationsRouter from './variations.router';
import reviewsRouter from './reviews.router';
import cartsRouter from './carts.router';
import addressesRouter from './addresses.router';
import wishlistsRouter from './wishlists.router';
import faqCategoriesRouter from './faq-categories.router';
import faqsRouter from './faqs.router';
import brandsRouter from './brands.router';
import tagsRouter from './tags.router';
import productTagsRouter from './product-tags.router';
import promotionsRouter from './promotions.router';

const router = Router();

router.get('/api/', (req: Request, res: Response, next: NextFunction) => {
  Promise.reject(new Error('Oops!'));
  res.status(200).send('Hello World');
});

router.get('/api/_health', healthRouter);

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
router.use('/api/addresses', addressesRouter);
router.use('/api/wishlists', wishlistsRouter);
router.use('/api/faq-categories', faqCategoriesRouter);
router.use('/api/faqs', faqsRouter);
router.use('/api/brands', brandsRouter);
router.use('/api/tags', tagsRouter);
router.use('/api/product-tags', productTagsRouter);
router.use('/api/promotions', promotionsRouter);

router.use(express.static(path.resolve(process.cwd(), 'public')));

router.use('*', notFoundMiddleware);

export default router;
