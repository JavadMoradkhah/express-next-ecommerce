import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateShippingMethodDto, UpdateShippingMethodDto } from '../dto';
import { shippingMethodsRepo } from '../repositories';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const shippingMethods = await shippingMethodsRepo.find({
    order: {
      price: 'ASC',
    },
  });

  return shippingMethods;
};

export const findOne = async (id: string) => {
  const shippingMethod = await shippingMethodsRepo.findOneBy({ id });

  if (!shippingMethod) {
    throw new NotFoundException(ErrorMessages.SHIPPING_METHOD_NOT_FOUND);
  }

  return shippingMethod;
};

export const create = async ({ name, price }: CreateShippingMethodDto) => {
  const exists = await shippingMethodsRepo.findOneBy({
    name,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SHIPPING_METHOD_ALREADY_EXISTS);
  }

  const shippingMethod = shippingMethodsRepo.create({
    name,
    price,
  });

  return await shippingMethodsRepo.save(shippingMethod);
};

export const update = async (id: string, { name, price }: UpdateShippingMethodDto) => {
  const shippingMethod = await findOne(id);

  if (name) shippingMethod.name = name;
  if (price !== undefined) shippingMethod.price = price;

  return await shippingMethodsRepo.save(shippingMethod);
};

export const remove = async (id: string) => {
  const shippingMethod = await findOne(id);
  await shippingMethodsRepo.remove(shippingMethod);
};
