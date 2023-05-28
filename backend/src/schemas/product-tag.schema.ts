import Joi from 'joi';
import { CreateProductTagDto, UpdateProductTagDto } from '../dto';

const schema: Record<keyof CreateProductTagDto, Joi.AnySchema> = {
  product: Joi.string().uuid(),
  tag: Joi.string().uuid(),
};

export const updateSchema = Joi.object<UpdateProductTagDto>(schema).min(1);

export const createSchema = Joi.object<CreateProductTagDto>({
  product: schema.product.required(),
  tag: schema.tag.required(),
});
