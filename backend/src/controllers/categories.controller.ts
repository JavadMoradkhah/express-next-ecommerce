import { IsNull } from 'typeorm';
import { NotFoundException } from '../common/exceptions';
import { categoriesRepo } from '../repositories';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const categories = await categoriesRepo.find({
    select: {
      id: true,
      name: true,
      slug: true,
      children: {
        id: true,
        name: true,
        slug: true,
      },
    },
    relations: {
      children: true,
    },
    where: { parent: IsNull() },
    order: {
      name: 'ASC',
    },
  });

  return categories;
};

export const findOne = async (id: string) => {
  const category = await categoriesRepo.findOne({
    where: {
      id,
    },
  });

  if (!category) {
    throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
  }

  return category;
};
