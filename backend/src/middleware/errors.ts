import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/status-code.enum';
import { HttpException } from '../common/exceptions';
import { StatusCodeName } from '../enums/status-code-name.enum';
import { MulterError } from 'multer';

export default async (error: any, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        message: StatusCodeName?.[500],
        error: StatusCodeName?.[500],
      });
    }
  }

  if (error instanceof MulterError) {
    return res.status(StatusCode.BAD_REQUEST).json({
      statusCode: StatusCode.BAD_REQUEST,
      message: error.message,
      error: StatusCodeName[400],
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.name,
    });
  }

  console.error(error);

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: StatusCodeName?.[500],
    error: StatusCodeName?.[500],
  });
};
