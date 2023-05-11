import { Request, Response } from 'express';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateSizeDto, UpdateSizeDto } from '../dto';
import { sizesRepo } from '../repositories/sizes.repo';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
  const sizes = await sizesRepo.find({
    order: {
      createdAt: 'DESC',
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: sizes,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
  const size = await sizesRepo.findOneBy({ id });

  if (!size) {
    throw new NotFoundException(ErrorMessages.SIZE_NOT_FOUND);
  }

  return size;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const size = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: size,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createSizeDto = req.body as CreateSizeDto;

  const exists = await sizesRepo.findOneBy({
    value: createSizeDto.value,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SIZE_ALREADY_EXISTS);
  }

  let size = sizesRepo.create({
    value: createSizeDto.value,
  });

  size = await sizesRepo.save(size);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: size,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateSizeDto = req.body as UpdateSizeDto;

  let size = await findOrFail(id);

  const exists = await sizesRepo.findOneBy({
    value: updateSizeDto.value,
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.SIZE_ALREADY_EXISTS);
  }

  size.value = updateSizeDto.value;

  size = await sizesRepo.save(size);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: size,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const size = await findOrFail(id);

  await sizesRepo.remove(size);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
