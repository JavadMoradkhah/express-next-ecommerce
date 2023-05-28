import { faqCategoriesRepo } from '../repositories';
import { BadRequestException, NotFoundException } from '../common/exceptions';
import { CreateFaqCategoryDto, UpdateFaqCategoryDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const categories = await faqCategoriesRepo.find({
    order: {
      createdAt: 'DESC',
    },
  });

  return categories;
};

export const findOne = async (id: string) => {
  const category = await faqCategoriesRepo.findOneBy({ id });

  if (!category) {
    throw new NotFoundException(ErrorMessages.FAQ_CATEGORY_NOT_FOUND);
  }

  return category;
};

export const create = async ({ name }: CreateFaqCategoryDto) => {
  let category = await faqCategoriesRepo.findOneBy({ name });

  if (category) {
    throw new BadRequestException(ErrorMessages.FAQ_CATEGORY_ALREADY_EXISTS);
  }

  category = await faqCategoriesRepo.save({
    name,
  });

  return category;
};

export const update = async (id: string, { name }: UpdateFaqCategoryDto) => {
  let category = await findOne(id);

  const exists = await faqCategoriesRepo.findOneBy({ name });

  if (exists) {
    throw new BadRequestException(ErrorMessages.FAQ_CATEGORY_ALREADY_EXISTS);
  }

  category.name = name;

  category = await faqCategoriesRepo.save({
    name,
  });

  return category;
};

export const remove = async (id: string) => {
  const category = await findOne(id);
  await faqCategoriesRepo.remove(category);
};
