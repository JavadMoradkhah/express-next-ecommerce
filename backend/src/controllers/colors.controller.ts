import ErrorMessages from '../enums/error-messages.enum';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { colorsRepo } from '../repositories';
import { CreateColorDto, UpdateColorDto } from '../dto';

export const findAll = async () => {
  const colors = await colorsRepo.find({
    order: {
      name: 'ASC',
    },
  });

  return colors;
};

export const findOne = async (id: string) => {
  const color = await colorsRepo.findOne({
    where: {
      id,
    },
  });

  if (!color) {
    throw new NotFoundException(ErrorMessages.COLOR_NOT_FOUND);
  }

  return color;
};

export const create = async (createColorDto: CreateColorDto) => {
  const exists = await colorsRepo.exist({
    where: [{ name: createColorDto.name }, { code: createColorDto.code }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COLOR_ALREADY_EXISTS);
  }

  const color = colorsRepo.create({
    name: createColorDto.name,
    code: createColorDto.code,
  });

  return await colorsRepo.save(color);
};

export const update = async (id: string, updateColorDto: UpdateColorDto) => {
  const color = await findOne(id);

  const exists = await colorsRepo.exist({
    where: [{ name: updateColorDto.name }, { code: updateColorDto.code }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COLOR_ALREADY_EXISTS);
  }

  if (updateColorDto.name) color.name = updateColorDto.name;
  if (updateColorDto.code) color.code = updateColorDto.code;

  return await colorsRepo.save(color);
};

export const remove = async (id: string) => {
  const color = await findOne(id);
  await colorsRepo.remove(color);
};
