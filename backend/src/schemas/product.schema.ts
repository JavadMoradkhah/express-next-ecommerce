import Joi from 'joi';
import { CreateProductDto, UpdateProductDto } from '../dto';

const schema: Record<keyof CreateProductDto, Joi.AnySchema> = {
  category: Joi.string().uuid(),
  title: Joi.string().max(255),
  description: Joi.string().max(1024),
  price: Joi.number().min(0).max(9_999_999.99).precision(2),
  discount: Joi.number().integer().min(0).max(100),
  orderLimit: Joi.number().integer().min(1).max(32_000),
  orderable: Joi.boolean(),
};

export const updateSchema = Joi.object<UpdateProductDto>(schema);

export const createSchema = Joi.object<CreateProductDto>({
  category: schema.category.required(),
  title: schema.title.required(),
  description: schema.description.required(),
  price: schema.price.required(),
});
