import { StatusCode } from '../enums/status-code.enum';

export interface ResponsePayload {
  statusCode: StatusCode;
  message?: string;
  data?: any;
}
