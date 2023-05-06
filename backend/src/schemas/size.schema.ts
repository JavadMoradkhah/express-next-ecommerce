import Joi from 'joi';
import { CreateSizeDto, UpdateSizeDto } from '../dto';

const schema = {
  value: Joi.string()
    .max(5)
    .regex(/^([0-9]+|((X+)?S|M|[0-9]?(X+)?L))$/)
    .required(),
};

export const updateSchema = Joi.object<UpdateSizeDto>(schema);

export const createSchema = Joi.object<CreateSizeDto>(schema);
