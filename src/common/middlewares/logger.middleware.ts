import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger(loggerMiddleware.name);
  morgan.token('url', (request): string => request._parsedUrl.pathname);
  morgan(
    ':method :url :status (:res[content-length] length) (:response-time ms)',
    {
      stream: {
        write: (text: string): void => logger.log(text),
      },
    },
  )(req, res, next);
}
