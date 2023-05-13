import { Color, Size } from '../entities';
import { variationsRepo } from '../repositories';
import { CreateVariationDto, UpdateVariationDto } from '../dto';
import * as productsController from './products.controller';
import * as colorsController from './colors.controller';
import * as sizesController from './sizes.controller';
import { ConflictException, NotFoundException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';
import { IsNull } from 'typeorm';

export const findOne = async (id: string) => {
  const variation = await variationsRepo.findOneBy({ id });

  if (!variation) {
    throw new NotFoundException(ErrorMessages.VARIATION_NOT_FOUND);
  }

  return variation;
};

export const create = async (createVariationDto: CreateVariationDto) => {
  let color: Color = null;
  let size: Size = null;

  const product = await productsController.findOne(createVariationDto.product);

  if (createVariationDto.color) {
    color = await colorsController.findOne(createVariationDto.color);
  }

  if (createVariationDto.size) {
    size = await sizesController.findOne(createVariationDto.size);
  }

  const exists = await checkVariationExists(product.id, color?.id, size?.id);

  if (exists) {
    throw new ConflictException(ErrorMessages.VARIATION_ALREADY_EXISTS);
  }

  const variation = variationsRepo.create({
    numberInStock: createVariationDto.numberInStock,
    price: createVariationDto.price ?? null,
    product: {
      id: product.id,
    },
    ...(color && {
      color: {
        id: color.id,
      },
    }),
    ...(size && {
      size: {
        id: size.id,
      },
    }),
  });

  return await variationsRepo.save(variation);
};

export const update = async (id: string, { numberInStock, price }: UpdateVariationDto) => {
  const variation = await findOne(id);

  if (numberInStock !== undefined) variation.numberInStock = numberInStock;
  if (price !== undefined) variation.price = price;

  //   let product: Product = null;
  //   let color: Color = null;
  //   let size: Size = null;

  //   const exists = await checkVariationExists(product.id , color?.id, size?.id);

  //   if (exists) {
  //     throw new ConflictException(ErrorMessages.VARIATION_ALREADY_EXISTS);
  //   }

  return await variationsRepo.save(variation);
};

export const remove = async (id: string) => {
  const variation = await findOne(id);
  await variationsRepo.remove(variation);
};

const checkVariationExists = async (productId: string, colorId?: string, sizeId?: string) => {
  return await variationsRepo.exist({
    where: {
      product: {
        id: productId,
      },
      color: {
        id: colorId || IsNull(),
      },
      size: {
        id: sizeId || IsNull(),
      },
    },
  });
};
