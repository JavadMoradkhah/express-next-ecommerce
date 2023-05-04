import { StatusCode } from '../../enums/status-code.enum';
import { HttpException } from './http-exception';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.BAD_REQUEST);
  }
}
