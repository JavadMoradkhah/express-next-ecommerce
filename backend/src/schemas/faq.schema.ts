import Joi from 'joi';
import { CreateFaqDto, UpdateFaqDto } from '../dto';

const schema: Record<keyof CreateFaqDto, Joi.AnySchema> = {
  category: Joi.string().uuid(),
  question: Joi.string().max(255),
  answer: Joi.string().max(2048),
};

export const createSchema = Joi.object<CreateFaqDto>({
  category: schema.category.required(),
  question: schema.question.required(),
  answer: schema.answer.required(),
});

export const updateSchema = Joi.object<UpdateFaqDto>(schema).min(1);
