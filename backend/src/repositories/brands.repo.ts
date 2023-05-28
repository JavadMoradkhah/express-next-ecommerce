import { AppDataSource } from '../config/database';
import { Brand } from '../entities/brand.entity';

export const brandsRepo = AppDataSource.getRepository(Brand);
