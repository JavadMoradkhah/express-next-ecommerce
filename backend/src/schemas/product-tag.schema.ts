import Joi from 'joi';
import { CreateProductTagDto } from '../dto';

const schema: Record<keyof CreateProductTagDto, Joi.AnySchema> = {
  product: Joi.string().uuid(),
  tag: Joi.string().uuid(),
};

export const createSchema = Joi.object<CreateProductTagDto>({
  product: schema.product.required(),
  tag: schema.tag.required(),
});
