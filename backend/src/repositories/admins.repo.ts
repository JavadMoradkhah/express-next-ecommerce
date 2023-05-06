import { AppDataSource } from '../config/database';
import { Admin } from '../entities';

export const adminsRepo = AppDataSource.getRepository(Admin);
