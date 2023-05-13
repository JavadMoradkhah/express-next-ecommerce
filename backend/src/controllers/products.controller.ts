import { NotFoundException } from '../common/exceptions';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { productsRepo } from '../repositories';
import * as categoriesController from './categories.controller';
import { Category, Product } from '../entities';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
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

  return products;
};

export const findOne = async (id: string, includeRelations = false) => {
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

export const create = async (createProductDto: CreateProductDto) => {
  const { title, description, price, discount, orderable, orderLimit } = createProductDto;

  const category = await categoriesController.findOne(createProductDto.category);

  let product = new Product();
  product.category = category;
  product.title = title;
  product.description = description;
  product.price = price;
  product.discount = discount;
  product.orderable = orderable;
  product.orderLimit = orderLimit;

  product = await productsRepo.save(product);

  return product;
};

export const update = async (id: string, updateProductDto: UpdateProductDto) => {
  let category: Category = null;

  const { title, description, price, discount, orderable, orderLimit } = updateProductDto;

  let product = await findOne(id);

  if (updateProductDto.category) {
    category = await categoriesController.findOne(updateProductDto.category);

    product.category = category;
  }

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (discount !== undefined) product.discount = discount;
  if (orderable !== undefined) product.orderable = orderable;
  if (orderLimit !== undefined) product.orderLimit = orderLimit;

  product = await productsRepo.save(product);

  return product;
};

export const remove = async (id: string) => {
  const product = await findOne(id);
  await productsRepo.remove(product);
};
