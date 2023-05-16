import { AppDataSource } from '../config/database';
import { Review } from '../entities/review.entity';

export const reviewsRepo = AppDataSource.getRepository(Review);
