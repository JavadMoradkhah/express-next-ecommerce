import { AppDataSource } from '../config/database';
import { CartItem } from '../entities/cart-item.entity';

export const cartItemsRepo = AppDataSource.getRepository(CartItem);
