import { AppDataSource } from '../config/database';
import { ShippingMethod } from '../entities/shipping-method.entity';

export const shippingMethodsRepo = AppDataSource.getRepository(ShippingMethod);
