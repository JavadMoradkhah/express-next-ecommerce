import Joi from 'joi';
import { CreateWishlistDto } from '../dto';

export const createSchema = Joi.object<CreateWishlistDto>({
  product: Joi.string().label('Product').uuid().required(),
});
