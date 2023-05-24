import Joi from 'joi';
import { CreateAddressDto, UpdateAddressDto } from '../dto';

const schema: Record<keyof CreateAddressDto, Joi.AnySchema> = {
  firstName: Joi.string().label('First Name').max(50),
  lastName: Joi.string().label('Last Name').max(50),
  phoneNumber: Joi.string().label('Phone Number').max(20),
  country: Joi.string().label('Country').uuid(),
  region: Joi.string().label('Region').max(20),
  city: Joi.string().label('City').max(20),
  addressLine1: Joi.string().label('Address Line1').max(255),
  addressLine2: Joi.string().label('Address Line2').max(255),
  postalCode: Joi.string().label('Postal Code').max(20),
  unitNumber: Joi.string().label('Unit Number').max(20),
  isDefault: Joi.boolean(),
  description: Joi.string().label('Description').max(255),
};

export const createSchema = Joi.object<CreateAddressDto>({
  ...schema,
  firstName: schema.firstName.required(),
  lastName: schema.lastName.required(),
  phoneNumber: schema.phoneNumber.required(),
  country: schema.country.required(),
  region: schema.region.required(),
  city: schema.city.required(),
  addressLine1: schema.addressLine1.required(),
  postalCode: schema.postalCode.required(),
});

export const updateSchema = Joi.object<UpdateAddressDto>(schema).min(1);
