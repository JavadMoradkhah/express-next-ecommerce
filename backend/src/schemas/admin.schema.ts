import Joi from 'joi';
import { LoginAdminDto } from '../dto';

export const loginSchema = Joi.object<LoginAdminDto>({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
