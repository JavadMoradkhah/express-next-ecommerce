import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateSizeDto, UpdateSizeDto } from '../dto';
import { sizesRepo } from '../repositories/sizes.repo';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const sizes = await sizesRepo.find({
    order: {
      createdAt: 'DESC',
    },
  });

  return sizes;
};

export const findOne = async (id: string) => {
  const size = await sizesRepo.findOneBy({ id });

  if (!size) {
    throw new NotFoundException(ErrorMessages.SIZE_NOT_FOUND);
  }

  return size;
};

export const create = async (createSizeDto: CreateSizeDto) => {
  const exists = await sizesRepo.findOneBy({
    value: createSizeDto.value,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SIZE_ALREADY_EXISTS);
  }

  const size = sizesRepo.create({
    value: createSizeDto.value,
  });

  return await sizesRepo.save(size);
};

export const update = async (id: string, updateSizeDto: UpdateSizeDto) => {
  const size = await findOne(id);

  const exists = await sizesRepo.findOneBy({
    value: updateSizeDto.value,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SIZE_ALREADY_EXISTS);
  }

  size.value = updateSizeDto.value;

  return await sizesRepo.save(size);
};

export const remove = async (id: string) => {
  const size = await findOne(id);
  await sizesRepo.remove(size);
};
