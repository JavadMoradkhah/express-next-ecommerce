import { ConflictException, NotFoundException } from '../common/exceptions';
import { tagsRepo } from '../repositories';
import { CreateTagDto, UpdateTagDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const tags = await tagsRepo.find({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    order: {
      name: 'ASC',
    },
  });

  return tags;
};

export const findOne = async (id: string) => {
  const tag = await tagsRepo.findOne({
    where: {
      id,
    },
  });

  if (!tag) {
    throw new NotFoundException(ErrorMessages.TAG_NOT_FOUND);
  }

  return tag;
};

export const create = async ({ name, slug }: CreateTagDto) => {
  const exists = await tagsRepo.exist({
    where: [{ name }, { slug }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.TAG_ALREADY_EXISTS);
  }

  const tag = await tagsRepo.save({
    name,
    slug,
  });

  return tag;
};

export const update = async (id: string, { name, slug }: UpdateTagDto) => {
  let tag = await findOne(id);

  const exists = await tagsRepo.exist({
    where: [{ name }, { slug }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.TAG_ALREADY_EXISTS);
  }

  if (name) tag.name = name;

  if (slug) tag.slug = slug;

  tag = await tagsRepo.save(tag);

  return tag;
};

export const remove = async (id: string) => {
  const tag = await findOne(id);
  await tagsRepo.remove(tag);
};
