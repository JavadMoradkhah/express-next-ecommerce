import { Request, Response } from 'express';
import { NotFoundException } from '../common/exceptions';
import { CreateProductImageDto, UpdateProductImageDto } from '../dto';
import { productImagesRepo } from '../repositories';
import * as productsController from './products.controller';
import * as uploadsController from './uploads.controller';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findOrFail = async (id: string) => {
  const productImage = await productImagesRepo.findOneBy({ id });

  if (!productImage) {
    throw new NotFoundException(ErrorMessages.PRODUCT_IMAGE_NOT_FOUND);
  }

  return productImage;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const productImage = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: productImage,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createImageDto = req.body as CreateProductImageDto;

  const product = await productsController.findOrFail(createImageDto.product);

  const image = await uploadsController.findOrFail(createImageDto.image);

  // Check whether the uploaded image is marked as the product main image or not
  if (createImageDto.isMain) {
    // Find the product's main image to unmark it as the main image
    const mainProductImage = await productImagesRepo.findOneBy({
      product: {
        id: product.id,
      },
      isMain: true,
    });

    if (mainProductImage) {
      mainProductImage.isMain = false;
      await productImagesRepo.save(mainProductImage);
    }
  }

  let productImage = productImagesRepo.create({
    product: {
      id: product.id,
    },
    image: {
      id: image.id,
    },
    isMain: createImageDto.isMain,
  });

  productImage = await productImagesRepo.save(productImage);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: productImage,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { isMain } = req.body as UpdateProductImageDto;

  const image = await findOrFail(id);

  image.isMain = isMain;

  const productImage = await productImagesRepo.save(image);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: productImage,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const productImage = await findOrFail(id);

  await productImagesRepo.remove(productImage);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
