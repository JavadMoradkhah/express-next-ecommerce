import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'error',
  format: format.json(),
  transports: [new transports.File({ filename: 'logs.log' })],
});
