import { Category } from '../../entities/category.entity';
import { ConflictException, NotFoundException } from '../../common/exceptions';
import { categoriesRepo } from '../../repositories';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto';
import { AdminQuery } from '../../interfaces';
import { getPaginationData, getPaginationParams } from '../../common/app-utils';
import ErrorMessages from '../../enums/error-messages.enum';

export const findAll = async ({ page, q }: AdminQuery) => {
  const { skip, take } = getPaginationParams(page);

  let query = categoriesRepo
    .createQueryBuilder('category')
    .select(['category.id', 'category.name', 'category.slug', 'parent.id', 'parent.name'])
    .leftJoin('category.parent', 'parent')
    .orderBy('category.name', 'ASC')
    .offset(skip)
    .limit(take);

  if (q) {
    query = query.where('MATCH (category.name) AGAINST (:query)', {
      query: q,
    });
  }

  const [categories, count] = await query.getManyAndCount();

  return {
    data: categories,
    pagination: getPaginationData(count, page, take),
  };
};

export const findOneOrFail = async (id: string) => {
  const category = await categoriesRepo.findOneBy({ id });

  if (!category) {
    throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUND);
  }

  return category;
};

export const findOne = async (id: string) => {
  const category = await categoriesRepo.findOne({
    where: {
      id,
    },
    relations: {
      parent: true,
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
    parent = await findOneOrFail(createCategoryDto.parent);
  }

  const exists = await categoriesRepo.exist({
    where: { slug: createCategoryDto.slug },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.CATEGORY_ALREADY_EXISTS);
  }

  const category = await categoriesRepo.save({
    name: createCategoryDto.name,
    slug: createCategoryDto.slug,
    ...(parent && {
      parent: {
        id: parent.id,
      },
    }),
  });

  return category;
};

export const update = async (id: string, updateCategoryDto: UpdateCategoryDto) => {
  let parent: Category = null;

  let category = await findOneOrFail(id);

  if (updateCategoryDto.parent) {
    parent = await findOneOrFail(updateCategoryDto.parent);

    category.parent = parent;
  }

  if (updateCategoryDto.slug && category.slug !== updateCategoryDto.slug) {
    const exists = await categoriesRepo.exist({
      where: { slug: updateCategoryDto.slug },
    });

    if (exists) {
      throw new ConflictException(ErrorMessages.CATEGORY_ALREADY_EXISTS);
    }

    category.slug = updateCategoryDto.slug;
  }

  if (updateCategoryDto.name) category.name = updateCategoryDto.name;

  category = await categoriesRepo.save(category);

  return category;
};

export const remove = async (id: string) => {
  const category = await findOneOrFail(id);
  await categoriesRepo.remove(category);
};
