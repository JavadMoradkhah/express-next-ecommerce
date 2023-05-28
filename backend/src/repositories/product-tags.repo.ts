import { AppDataSource } from '../config/database';
import { ProductTag } from '../entities/product-tag.entity';

export const productTagsRepo = AppDataSource.getRepository(ProductTag);
