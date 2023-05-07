import Joi from 'joi';
import { CreateColorDto, UpdateColorDto } from '../dto';

const schema = {
  name: Joi.string().max(50),
  code: Joi.string()
    .length(7)
    .regex(/^#[A-Fa-f0-9]+$/),
};

export const updateSchema = Joi.object<UpdateColorDto>(schema).min(1);

export const createSchema = Joi.object<CreateColorDto>({
  name: schema.name.required(),
  code: schema.code.required(),
});
