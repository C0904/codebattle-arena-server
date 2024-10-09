import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode <= 304) {
        this.logger.log(
          `${originalUrl} (${statusCode}) ${ip} ${userAgent}`,
          method,
        );
      } else if (statusCode >= 400 && statusCode < 500)
        this.logger.warn(
          `${originalUrl} (${statusCode}) ${ip} ${userAgent}`,
          method,
        );
      else if (statusCode >= 500)
        this.logger.error(
          `${originalUrl} (${statusCode}) ${ip} ${userAgent}`,
          method,
        );
    });

    next();
  }
}
