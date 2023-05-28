import { BadRequestException, ConflictException, NotFoundException } from '../common/exceptions';
import { productTagsRepo, productsRepo, tagsRepo } from '../repositories';
import { CreateProductTagDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const productTags = await productTagsRepo.find({
    select: {
      id: true,
      product: {
        id: true,
        title: true,
      },
      tag: {
        id: true,
        name: true,
      },
    },
    relations: {
      product: true,
      tag: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return productTags;
};

export const findOne = async (id: string) => {
  const productTag = await productTagsRepo.findOne({
    where: {
      id,
    },
  });

  if (!productTag) {
    throw new NotFoundException(ErrorMessages.PRODUCT_TAG_NOT_FOUND);
  }

  return productTag;
};

export const create = async ({ product: productId, tag: tagId }: CreateProductTagDto) => {
  const product = await productsRepo.findOneBy({ id: productId });

  if (!product) {
    throw new BadRequestException(ErrorMessages.PRODUCT_NOT_FOUND);
  }

  const tag = await tagsRepo.findOneBy({ id: tagId });

  if (!tag) {
    throw new BadRequestException(ErrorMessages.TAG_NOT_FOUND);
  }

  const exists = await productTagsRepo.exist({
    where: {
      product: {
        id: productId,
      },
      tag: {
        id: tagId,
      },
    },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.PRODUCT_TAG_ALREADY_ADDED);
  }

  const productTag = await productTagsRepo.save({
    product: {
      id: productId,
    },
    tag: {
      id: tagId,
    },
  });

  return productTag;
};

export const remove = async (id: string) => {
  const tag = await findOne(id);
  await productTagsRepo.remove(tag);
};
