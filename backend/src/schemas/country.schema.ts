import Joi from 'joi';
import { CreateCountryDto, UpdateCountryDto } from '../dto';

const schema = {
  name: Joi.string().max(50).required(),
};

export const updateSchema = Joi.object<UpdateCountryDto>(schema);

export const createSchema = Joi.object<CreateCountryDto>(schema);
