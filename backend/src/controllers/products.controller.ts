import { Request, Response } from 'express';
import { NotFoundException } from '../common/exceptions';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { productsRepo } from '../repositories';
import * as categoriesController from './categories.controller';
import { Category, Product } from '../entities';
import ErrorMessages from '../enums/error-messages.enum';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';

export const findAll = async (req: Request, res: Response) => {
  const products = await productsRepo.find({
    select: {
      id: true,
      title: true,
      price: true,
      discount: true,
      images: {
        id: true,
        image: {
          imageUrl: true,
          alt: true,
        },
        isMain: true,
      },
    },
    relations: {
      images: {
        image: true,
      },
    },
    order: {
      updatedAt: 'DESC',
    },
    where: {
      orderable: true,
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: products,
  } as ResponsePayload);
};

export const findOrFail = async (id: string, includeRelations = false) => {
  const product = await productsRepo.findOne({
    where: {
      id,
    },
    ...(includeRelations && {
      relations: {
        category: true,
        images: {
          image: true,
        },
      },
    }),
  });

  if (!product) {
    throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
  }

  return product;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: product,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createProductDto = req.body as CreateProductDto;

  const { title, description, price, discount, orderable, orderLimit } = createProductDto;

  const category = await categoriesController.findOrFail(createProductDto.category);

  let product = new Product();
  product.category = category;
  product.title = title;
  product.description = description;
  product.price = price;
  product.discount = discount;
  product.orderable = orderable;
  product.orderLimit = orderLimit;

  product = await productsRepo.save(product);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: product,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateProductDto = req.body as UpdateProductDto;
  let category: Category = null;

  const { title, description, price, discount, orderable, orderLimit } = updateProductDto;

  let product = await findOrFail(id);

  if (updateProductDto.category) {
    category = await categoriesController.findOrFail(updateProductDto.category);

    product.category = category;
  }

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (discount !== undefined) product.discount = discount;
  if (orderable !== undefined) product.orderable = orderable;
  if (orderLimit !== undefined) product.orderLimit = orderLimit;

  product = await productsRepo.save(product);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: product,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const product = await findOrFail(id);

  await productsRepo.remove(product);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
