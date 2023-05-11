import { Request, Response } from 'express';
import { IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { categoriesRepo } from '../repositories';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
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

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: categories,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
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

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: category,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createCategoryDto = req.body as CreateCategoryDto;

  let parent: Category = null;

  if (createCategoryDto.parent) {
    parent = await findOrFail(createCategoryDto.parent);
  }

  const exists = await categoriesRepo.exist({
    where: { slug: createCategoryDto.slug },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.CATEGORY_ALREADY_EXISTS);
  }

  const category = await categoriesRepo.save(
    categoriesRepo.create({
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      ...(parent && {
        parent: {
          id: parent.id,
        },
      }),
    })
  );

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: category,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;

  const updateCategoryDto = req.body as UpdateCategoryDto;

  let parent: Category = null;

  let category = await findOrFail(id);

  if (updateCategoryDto.parent) {
    parent = await findOrFail(updateCategoryDto.parent);

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

  category = await categoriesRepo.save(category);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: category,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const category = await findOrFail(id);

  await categoriesRepo.remove(category);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
