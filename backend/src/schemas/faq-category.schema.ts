import Joi from 'joi';
import { CreateFaqCategoryDto, UpdateFaqCategoryDto } from '../dto';

const schema: Record<keyof CreateFaqCategoryDto, Joi.AnySchema> = {
  name: Joi.string().max(100).required(),
};

export const createSchema = Joi.object<CreateFaqCategoryDto>(schema);

export const updateSchema = Joi.object<UpdateFaqCategoryDto>(schema);
