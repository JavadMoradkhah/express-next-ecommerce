import { ConflictException, NotFoundException } from '../../common/exceptions';
import { brandsRepo } from '../../repositories';
import { CreateBrandDto, UpdateBrandDto } from '../../dto';
import { AdminQuery } from '../../interfaces';
import { getPaginationParams, getPaginatedResponse } from '../../common/app-utils';
import ErrorMessages from '../../enums/error-messages.enum';

export const findAll = async ({ page, q }: AdminQuery) => {
  const { skip, take } = getPaginationParams(page);

  let query = brandsRepo
    .createQueryBuilder('brand')
    .select(['brand.id', 'brand.name', 'brand.slug'])
    .orderBy('brand.name', 'ASC')
    .take(take)
    .skip(skip);

  if (q) {
    query = query
      .where('MATCH(brand.name) AGAINST(:query IN NATURAL LANGUAGE MODE)')
      .setParameter('query', q);
  }

  const [brands, count] = await query.getManyAndCount();

  return getPaginatedResponse(brands, count, page, take);
};

export const findOne = async (id: string) => {
  const brand = await brandsRepo.findOne({
    where: {
      id,
    },
  });

  if (!brand) {
    throw new NotFoundException(ErrorMessages.BRAND_NOT_FOUND);
  }

  return brand;
};

export const create = async ({ name, slug }: CreateBrandDto) => {
  const exists = await brandsRepo.exist({
    where: { slug },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.BRAND_ALREADY_EXISTS);
  }

  const brand = await brandsRepo.save({
    name,
    slug,
  });

  return brand;
};

export const update = async (id: string, { name, slug }: UpdateBrandDto) => {
  let brand = await findOne(id);

  if (slug) {
    const exists = await brandsRepo.exist({
      where: { slug },
    });

    if (exists) {
      throw new ConflictException(ErrorMessages.BRAND_ALREADY_EXISTS);
    }

    brand.slug = slug;
  }

  if (name) {
    brand.name = name;
  }

  brand = await brandsRepo.save(brand);

  return brand;
};

export const remove = async (id: string) => {
  const brand = await findOne(id);
  await brandsRepo.remove(brand);
};
