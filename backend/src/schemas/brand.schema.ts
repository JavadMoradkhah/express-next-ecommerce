import Joi from 'joi';
import { CreateBrandDto, UpdateBrandDto } from '../dto';

const schema: Record<keyof CreateBrandDto, Joi.AnySchema> = {
  name: Joi.string().max(50),
  slug: Joi.string()
    .max(50)
    .regex(/^[a-z0-9]+(-?[a-z0-9]+)*$/, {
      name: 'slug',
    }),
};

export const updateSchema = Joi.object<UpdateBrandDto>(schema).min(1);

export const createSchema = Joi.object<CreateBrandDto>({
  name: schema.name.required(),
  slug: schema.slug.required(),
});
