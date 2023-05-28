import { AppDataSource } from '../config/database';
import { FAQ } from '../entities/faq.entity';

export const faqsRepo = AppDataSource.getRepository(FAQ);
