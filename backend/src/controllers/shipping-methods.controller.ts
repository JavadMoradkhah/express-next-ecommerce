import { Request, Response } from 'express';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateShippingMethodDto, UpdateShippingMethodDto } from '../dto';
import { shippingMethodsRepo } from '../repositories';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
  const shippingMethods = await shippingMethodsRepo.find({
    order: {
      price: 'ASC',
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: shippingMethods,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
  const shippingMethod = await shippingMethodsRepo.findOneBy({ id });

  if (!shippingMethod) {
    throw new NotFoundException(ErrorMessages.SHIPPING_METHOD_NOT_FOUND);
  }

  return shippingMethod;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const shippingMethod = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: shippingMethod,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const { name, price } = req.body as CreateShippingMethodDto;

  const exists = await shippingMethodsRepo.findOneBy({
    name,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SHIPPING_METHOD_ALREADY_EXISTS);
  }

  let shippingMethod = shippingMethodsRepo.create({
    name,
    price,
  });

  shippingMethod = await shippingMethodsRepo.save(shippingMethod);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: shippingMethod,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;

  const { name, price } = req.body as UpdateShippingMethodDto;

  let shippingMethod = await findOrFail(id);

  if (name) shippingMethod.name = name;
  if (price !== undefined) shippingMethod.price = price;

  shippingMethod = await shippingMethodsRepo.save(shippingMethod);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: shippingMethod,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const shippingMethod = await findOrFail(id);

  await shippingMethodsRepo.remove(shippingMethod);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
