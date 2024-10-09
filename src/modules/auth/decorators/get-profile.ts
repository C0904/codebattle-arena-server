import { SwaggerExceptionDto } from '@app/common/dto/swaggerException.dto';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function GetProfile(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: '유저 프로필 조회' }),
    ApiBearerAuth('authorization'),
    ApiBadRequestResponse({ type: SwaggerExceptionDto }),
    ApiUnauthorizedResponse({ type: SwaggerExceptionDto }),
    ApiConflictResponse({ type: SwaggerExceptionDto }),
    ApiInternalServerErrorResponse({ type: SwaggerExceptionDto }),
  );
}
