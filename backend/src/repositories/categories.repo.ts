import { AppDataSource } from '../config/database';
import { Category } from '../entities/category.entity';

export const categoriesRepo = AppDataSource.getRepository(Category);
