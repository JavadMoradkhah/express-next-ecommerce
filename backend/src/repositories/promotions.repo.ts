import { AppDataSource } from '../config/database';
import { Promotion } from '../entities/promotion.entity';

export const promotionsRepo = AppDataSource.getRepository(Promotion);
