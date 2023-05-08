import Joi from 'joi';
import { CreateProductImageDto, UpdateProductImageDto } from '../dto';

export const updateSchema = Joi.object<UpdateProductImageDto>({
  isMain: Joi.boolean().required(),
});

export const createSchema = Joi.object<CreateProductImageDto>({
  product: Joi.string().uuid().required(),
  image: Joi.string().uuid().required(),
  isMain: Joi.boolean(),
});
