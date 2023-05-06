import Joi from 'joi';
import { CreateUploadDto, UpdateUploadDto } from '../dto';

const schema = {
  alt: Joi.string().max(255).required(),
};

export const updateSchema = Joi.object<UpdateUploadDto>(schema);

export const createSchema = Joi.object<CreateUploadDto>(schema);
