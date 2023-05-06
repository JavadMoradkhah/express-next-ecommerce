import { AppDataSource } from '../config/database';
import { Country } from '../entities/country.entity';

export const countriesRepo = AppDataSource.getRepository(Country);
