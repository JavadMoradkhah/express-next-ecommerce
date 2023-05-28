import { ConflictException, NotFoundException } from '../common/exceptions';
import { brandsRepo } from '../repositories';
import { CreateBrandDto, UpdateBrandDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const brands = await brandsRepo.find({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    order: {
      name: 'ASC',
    },
  });

  return brands;
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
