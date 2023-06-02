import Joi from 'joi';
import { CreatePromotionDto, UpdatePromotionDto } from '../dto';

const schema: Record<keyof CreatePromotionDto, Joi.AnySchema> = {
  product: Joi.string().uuid().required(),
  startDate: Joi.string()
    .regex(/^[0-9]{4}(-[0-9]{2}){2}$/)
    .required(),
  endDate: Joi.string()
    .regex(/^[0-9]{4}(-[0-9]{2}){2}$/)
    .required(),
  discountRate: Joi.number().integer().greater(0).less(100).required(),
};

export const updateSchema = Joi.object<UpdatePromotionDto>({
  startDate: schema.startDate,
  endDate: schema.endDate,
  discountRate: schema.discountRate,
});

export const createSchema = Joi.object<CreatePromotionDto>(schema);
