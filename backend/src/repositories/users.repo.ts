import { AppDataSource } from '../config/database';
import { User } from '../entities';

export const usersRepo = AppDataSource.getRepository(User);
