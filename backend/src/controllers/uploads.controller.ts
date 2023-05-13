import * as path from 'path';
import fs from 'fs/promises';
import { Request } from 'express';
import { uploadsRepo } from '../repositories';
import { CreateUploadDto, UpdateUploadDto } from '../dto';
import { UploadLocation } from '../common/upload-options';
import { NotFoundException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const uploads = await uploadsRepo.find({
    order: {
      createdAt: 'DESC',
    },
  });

  return uploads;
};

export const findOne = async (id: string) => {
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

export const create = async (req: Request, createUploadDto: CreateUploadDto) => {
  let upload = uploadsRepo.create({
    alt: createUploadDto.alt,
    imageName: req.file.filename,
    location: UploadLocation.IMAGES,
  });

  upload = await uploadsRepo.save(upload);

  return upload;
};

export const update = async (id: string, updateUploadDto: UpdateUploadDto) => {
  let file = await findOne(id);

  file.alt = updateUploadDto.alt;

  file = await uploadsRepo.save(file);

  return file;
};

export const remove = async (id: string) => {
  const image = await findOne(id);
  await fs.unlink(path.join(process.cwd(), './public', image.imageUrl));
  await uploadsRepo.remove(image);
};
