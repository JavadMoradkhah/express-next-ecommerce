import { AppDataSource } from '../config/database';
import { Product } from '../entities/product.entity';

export const productsRepo = AppDataSource.getRepository(Product);
