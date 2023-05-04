import { IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import ErrorMessages from '../enums/error-messages.enum';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { categoriesRepo } from '../repositories';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';

export const findAll = async () => {
  const categories = await categoriesRepo.find({
    select: {
      id: true,
      name: true,
      slug: true,
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

export const create = async (createCategoryDto: CreateCategoryDto) => {
  let parent: Category = null;

  if (createCategoryDto.parent) {
    parent = await findOne(createCategoryDto.parent);
  }

  const exists = await categoriesRepo.exist({
    where: { slug: createCategoryDto.slug },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.CATEGORY_ALREADY_EXISTS);
  }

  const category = categoriesRepo.create({
    name: createCategoryDto.name,
    slug: createCategoryDto.slug,
    parent: {
      id: parent.id,
    },
  });

  return await categoriesRepo.save(category);
};

export const update = async (id: string, updateCategoryDto: UpdateCategoryDto) => {
  let parent: Category = null;

  const category = await findOne(id);

  if (updateCategoryDto.parent) {
    parent = await findOne(updateCategoryDto.parent);

    category.parent = parent;
  }

  if (updateCategoryDto.slug) {
    const exists = await categoriesRepo.exist({
      where: { slug: updateCategoryDto.slug },
    });

    if (exists) {
      throw new ConflictException(ErrorMessages.CATEGORY_ALREADY_EXISTS);
    }

    category.slug = updateCategoryDto.slug;
  }

  if (updateCategoryDto.name) category.name = updateCategoryDto.name;

  return await categoriesRepo.save(category);
};

export const remove = async (id: string) => {
  const category = await findOne(id);
  await categoriesRepo.remove(category);
};
