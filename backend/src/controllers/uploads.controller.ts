import * as path from 'path';
import fs from 'fs/promises';
import { Request, Response } from 'express';
import { uploadsRepo } from '../repositories';
import { CreateUploadDto, UpdateUploadDto } from '../dto';
import { UploadLocation } from '../common/upload-options';
import { NotFoundException } from '../common/exceptions';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
  const uploads = await uploadsRepo.find({
    order: {
      createdAt: 'DESC',
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: uploads,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
  const file = await uploadsRepo.findOne({
    where: {
      id,
    },
  });

  if (!file) {
    throw new NotFoundException(ErrorMessages.FILE_NOT_FOUND);
  }

  return file;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const file = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: file,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const createUploadDto = req.body as CreateUploadDto;

  let upload = uploadsRepo.create({
    alt: createUploadDto.alt,
    imageName: req.file.filename,
    location: UploadLocation.IMAGES,
  });

  upload = await uploadsRepo.save(upload);

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: upload,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateUploadDto = req.body as UpdateUploadDto;

  let file = await findOrFail(id);

  file.alt = updateUploadDto.alt;

  file = await uploadsRepo.save(file);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: file,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const image = await findOrFail(id);

  await fs.unlink(path.join(process.cwd(), './public', image.imageUrl));

  await uploadsRepo.remove(image);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};
