import { AppDataSource } from '../config/database';
import { FaqCategory } from '../entities/faq-category.entity';

export const faqCategoriesRepo = AppDataSource.getRepository(FaqCategory);
