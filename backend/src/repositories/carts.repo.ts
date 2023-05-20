import { AppDataSource } from '../config/database';
import { Cart } from '../entities/cart.entity';

export const cartsRepo = AppDataSource.getRepository(Cart);
