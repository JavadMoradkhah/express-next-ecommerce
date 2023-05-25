import { AppDataSource } from '../config/database';
import { Wishlist } from '../entities';

export const wishlistsRepo = AppDataSource.getRepository(Wishlist);
