import { AppDataSource } from '../config/database';
import { Size } from '../entities/size.entity';

export const sizesRepo = AppDataSource.getRepository(Size);
