import { AppDataSource } from '../config/database';
import { Variation } from '../entities';

export const variationsRepo = AppDataSource.getRepository(Variation);
