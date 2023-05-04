import Joi from 'joi';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

const schema = {
  name: Joi.string().max(50),
  slug: Joi.string().max(50),
  parent: Joi.string().uuid(),
};

export const updateSchema = Joi.object<UpdateCategoryDto>(schema).min(1);

export const createSchema = Joi.object<CreateCategoryDto>({
  name: schema.name.required(),
  slug: schema.slug.required(),
  parent: schema.parent,
});
