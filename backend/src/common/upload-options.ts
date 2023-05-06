import path from 'path';
import fs from 'fs/promises';
import { Request } from 'express';
import { diskStorage, Options } from 'multer';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export const enum UploadLocation {
  IMAGES = '/uploads/images/',
}

const options: Options = {
  storage: diskStorage({
    async destination(req: Request, file: Express.Multer.File, cb): Promise<void> {
      const uploadsPath = path.join(process.cwd(), './public', UploadLocation.IMAGES);
      await fs.mkdir(uploadsPath, { recursive: true });
      cb(null, uploadsPath);
    },
    filename(req: Request, file: Express.Multer.File, cb) {
      const extension = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extension);
    },
  }),
  limits: {
    fileSize: 1024 ** 2 * 2, // 2 MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const allowedFileTypes = ['image/jpeg'];
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new BadRequestException(ErrorMessages.FILE_TYPE_NOT_ALLOWED));
    }

    cb(null, true);
  },
};

export default options;
