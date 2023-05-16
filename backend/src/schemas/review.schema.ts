import Joi from 'joi';
import { CreateReviewDto, UpdateReviewDto } from '../dto';

const schema: Record<keyof CreateReviewDto, Joi.AnySchema> = {
  product: Joi.string().uuid(),
  rating: Joi.number().min(0).max(5).precision(1),
  comment: Joi.string().max(1000),
};

export const updateSchema = Joi.object<UpdateReviewDto>(schema).min(1);

export const createSchema = Joi.object<CreateReviewDto>({
  product: schema.product.required(),
  rating: schema.rating.required(),
  comment: schema.comment.required(),
});
