import Joi from 'joi';
import { CreateTagDto, UpdateTagDto } from '../dto';

const schema: Record<keyof CreateTagDto, Joi.AnySchema> = {
  name: Joi.string().max(50),
  slug: Joi.string()
    .max(50)
    .regex(/^[a-z0-9]+(-?[a-z0-9]+)*$/, {
      name: 'slug',
    }),
};

export const updateSchema = Joi.object<UpdateTagDto>(schema).min(1);

export const createSchema = Joi.object<CreateTagDto>({
  name: schema.name.required(),
  slug: schema.slug.required(),
});
