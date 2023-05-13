import Joi from 'joi';
import { CreateVariationDto, UpdateVariationDto } from '../dto';

const schema: Record<keyof CreateVariationDto, Joi.AnySchema> = {
  product: Joi.string().label('Product').uuid(),
  color: Joi.string().label('Color').uuid(),
  size: Joi.string().label('Size').uuid(),
  price: Joi.number().label('Price').min(0).max(9_999_999.99).precision(2),
  numberInStock: Joi.number().integer().label('Number In Stock').min(0).max(32_000),
};

export const createSchema = Joi.object<CreateVariationDto>({
  ...schema,
  product: schema.product.required(),
  numberInStock: schema.numberInStock.required(),
});

export const updateSchema = Joi.object<UpdateVariationDto>({
  numberInStock: schema.numberInStock,
  price: schema.price,
}).min(1);
