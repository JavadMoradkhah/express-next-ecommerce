import { AppDataSource } from '../config/database';
import { Admin } from '../entities/admin.entity';

export const adminsRepo = AppDataSource.getRepository(Admin);
