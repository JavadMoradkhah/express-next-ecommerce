import { StatusCode } from '../../enums/status-code.enum';
import { HttpException } from './http-exception';

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.INTERNAL_SERVER_ERROR);
  }
}
