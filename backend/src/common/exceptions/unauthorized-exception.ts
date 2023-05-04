import { StatusCode } from '../../enums/status-code.enum';
import { HttpException } from './http-exception';

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, StatusCode.UNAUTHORIZED);
  }
}
