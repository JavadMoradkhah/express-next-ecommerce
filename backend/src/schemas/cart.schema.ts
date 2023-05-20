import Joi from 'joi';
import { CreateCartDto, UpdateCartDto } from '../dto';

const schema: Record<keyof CreateCartDto, Joi.AnySchema> = {
  variation: Joi.string().label('Variation').uuid(),
  quantity: Joi.number().label('Quantity').integer().positive().max(32_000),
};

export const updateSchema = Joi.object<UpdateCartDto>({
  quantity: schema.quantity.required(),
});

export const createSchema = Joi.object<CreateCartDto>({
  variation: schema.variation.required(),
  quantity: schema.quantity.required(),
});
