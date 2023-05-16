import Joi from 'joi';
import { CreateReviewDto, UpdateReviewDto, UpdateReviewStatusDto } from '../dto';
import { ReviewStatus } from '../entities';

const schema: Record<keyof CreateReviewDto, Joi.AnySchema> = {
  product: Joi.string().label('Product').uuid(),
  rating: Joi.number().label('Rating').min(0).max(5),
  comment: Joi.string().label('Comment').max(1000),
};

export const updateSchema = Joi.object<UpdateReviewDto>(schema).min(1).label('Review');

export const updateStatusSchema = Joi.object<UpdateReviewStatusDto>({
  status: Joi.string()
    .label('Status')
    .valid(ReviewStatus.CONFIRMED, ReviewStatus.REJECTED)
    .required(),
});

export const createSchema = Joi.object<CreateReviewDto>({
  product: schema.product.required(),
  rating: schema.rating.required(),
  comment: schema.comment.required(),
});
