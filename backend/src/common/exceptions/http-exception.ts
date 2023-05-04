import { StatusCodeName } from '../../enums/status-code-name.enum';

type StatusCode = keyof typeof StatusCodeName;

export class HttpException extends Error {
  public readonly statusCode: StatusCode;
  public override readonly message: string;
  public override readonly name: string = StatusCodeName[500];

  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = StatusCodeName?.[statusCode];
  }
}
