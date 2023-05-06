import { AppDataSource } from '../config/database';
import { Color } from '../entities';

export const colorsRepo = AppDataSource.getRepository(Color);
