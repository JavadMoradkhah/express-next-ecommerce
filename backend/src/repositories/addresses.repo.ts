import { AppDataSource } from '../config/database';
import { Address } from '../entities/address.entity';

export const addressesRepo = AppDataSource.getRepository(Address);
