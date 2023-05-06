import { AppDataSource } from '../config/database';
import { Color } from '../entities/color.entity';

export const colorsRepo = AppDataSource.getRepository(Color);
