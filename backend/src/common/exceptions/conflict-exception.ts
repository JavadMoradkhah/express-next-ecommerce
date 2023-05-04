import { StatusCode } from '../../enums/status-code.enum';
import { HttpException } from './http-exception';

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.CONFLICT);
  }
}
