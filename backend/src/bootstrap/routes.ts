import express, { Express } from 'express';
import * as path from 'path';
import appRouter from '../routes/app.router';
import authRouter from '../routes/auth.router';
import categoryRouter from '../routes/categories.router';
import colorRouter from '../routes/colors.router';
import countryRouter from '../routes/countries.router';
import sizeRouter from '../routes/sizes.router';
import shippingMethodRouter from '../routes/shipping-methods.router';
import uploadsRouter from '../routes/uploads.router';
import productsRouter from '../routes/products.router';
import productImagesRouter from '../routes/product-images.router';

export default function (app: Express) {
  app.use('/api/', appRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/colors', colorRouter);
  app.use('/api/countries', countryRouter);
  app.use('/api/shipping-methods', shippingMethodRouter);
  app.use('/api/sizes', sizeRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/product-images', productImagesRouter);

  app.use('/public', express.static(path.resolve(process.cwd(), 'public')));
}
