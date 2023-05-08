import { AppDataSource } from '../config/database';
import { ProductImage } from '../entities/product-image.entity';

export const productImagesRepo = AppDataSource.getRepository(ProductImage);
