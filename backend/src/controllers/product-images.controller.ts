import { NotFoundException } from '../common/exceptions';
import { CreateProductImageDto, UpdateProductImageDto } from '../dto';
import { productImagesRepo } from '../repositories';
import * as productsController from './products.controller';
import * as uploadsController from './uploads.controller';
import ErrorMessages from '../enums/error-messages.enum';

export const findOne = async (id: string) => {
  const productImage = await productImagesRepo.findOneBy({ id });

  if (!productImage) {
    throw new NotFoundException(ErrorMessages.PRODUCT_IMAGE_NOT_FOUND);
  }

  return productImage;
};

export const create = async (createImageDto: CreateProductImageDto) => {
  const product = await productsController.findOne(createImageDto.product);

  const image = await uploadsController.findOne(createImageDto.image);

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

  return productImage;
};

export const update = async (id: string, { isMain }: UpdateProductImageDto) => {
  const image = await findOne(id);

  image.isMain = isMain;

  const productImage = await productImagesRepo.save(image);

  return productImage;
};

export const remove = async (id: string) => {
  const productImage = await findOne(id);
  await productImagesRepo.remove(productImage);
};
