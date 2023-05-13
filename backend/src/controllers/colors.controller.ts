import { ConflictException, NotFoundException } from '../common/exceptions';
import { colorsRepo } from '../repositories';
import { CreateColorDto, UpdateColorDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

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

  const color = await colorsRepo.save(
    colorsRepo.create({
      name: createColorDto.name,
      code: createColorDto.code,
    })
  );

  return color;
};

export const update = async (id: string, updateColorDto: UpdateColorDto) => {
  let color = await findOne(id);

  const exists = await colorsRepo.exist({
    where: [{ name: updateColorDto.name }, { code: updateColorDto.code }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COLOR_ALREADY_EXISTS);
  }

  if (updateColorDto.name) color.name = updateColorDto.name;
  if (updateColorDto.code) color.code = updateColorDto.code;

  color = await colorsRepo.save(color);

  return color;
};

export const remove = async (id: string) => {
  const color = await findOne(id);
  await colorsRepo.remove(color);
};
