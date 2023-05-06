import { AppDataSource } from '../config/database';
import { Upload } from '../entities';

export const uploadsRepo = AppDataSource.getRepository(Upload);
