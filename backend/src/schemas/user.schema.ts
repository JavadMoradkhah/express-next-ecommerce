import Joi from 'joi';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../dto';

const schema: Record<keyof CreateUserDto, Joi.AnySchema> = {
  firstName: Joi.string().label('First name').min(2).max(50),
  lastName: Joi.string().label('Last name').min(2).max(50),
  email: Joi.string().label('Email').min(5).max(50).email(),
  password: Joi.string().label('Password').min(8).max(50),
};

export const createSchema = Joi.object<CreateUserDto>({
  firstName: schema.firstName.required(),
  lastName: schema.lastName.required(),
  email: schema.email.required(),
  password: schema.password.required(),
});

export const loginSchema = Joi.object<LoginDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateSchema = Joi.object<UpdateUserDto>(schema);
