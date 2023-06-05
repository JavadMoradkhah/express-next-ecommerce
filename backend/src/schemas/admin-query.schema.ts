import Joi from 'joi';
import { AdminQuery } from '../interfaces';

export const adminQuerySchema = Joi.object<AdminQuery>({
  page: Joi.number().integer().positive(),
  q: Joi.string().max(255),
});
