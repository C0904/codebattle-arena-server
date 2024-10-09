import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ResMessage } from '@app/common/enum/res-message.enum';

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : ResMessage.INTERNAL_SERVER_ERROR;

    Logger.debug(exception ?? 'Internal Server Error');

    response.status(httpCode).json({
      success: false,
      message,
    });
  }
}
