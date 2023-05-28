import Joi from 'joi';
import { CreatePromotionDto, UpdatePromotionDto } from '../dto';

const schema: Record<keyof CreatePromotionDto, Joi.AnySchema> = {
  product: Joi.string().uuid(),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
  discountRate: Joi.number().integer().greater(0).less(100),
};

export const updateSchema = Joi.object<UpdatePromotionDto>(schema).min(1);

export const createSchema = Joi.object<CreatePromotionDto>({
  product: schema.product.required(),
  startDate: schema.startDate,
  endDate: schema.endDate.required(),
  discountRate: schema.discountRate.required(),
});
