import Joi from 'joi';
import { CreateShippingMethodDto, UpdateShippingMethodDto } from '../dto';

const schema = {
  name: Joi.string().max(50),
  price: Joi.number().min(0).max(9_999.99).precision(2),
};

export const updateSchema = Joi.object<UpdateShippingMethodDto>(schema).min(1);

export const createSchema = Joi.object<CreateShippingMethodDto>({
  name: schema.name.required(),
  price: schema.price.required(),
});
