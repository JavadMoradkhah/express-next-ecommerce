import { Request, Response } from 'express';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { colorsRepo } from '../repositories';
import { CreateColorDto, UpdateColorDto } from '../dto';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
  const colors = await colorsRepo.find({
    order: {
      name: 'ASC',
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: colors,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
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

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const color = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: color,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createColorDto = req.body as CreateColorDto;

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

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: color,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateColorDto = req.body as UpdateColorDto;

  let color = await findOrFail(id);

  const exists = await colorsRepo.exist({
    where: [{ name: updateColorDto.name }, { code: updateColorDto.code }],
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COLOR_ALREADY_EXISTS);
  }

  if (updateColorDto.name) color.name = updateColorDto.name;
  if (updateColorDto.code) color.code = updateColorDto.code;

  color = await colorsRepo.save(color);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: color,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const color = await findOrFail(id);

  await colorsRepo.remove(color);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
