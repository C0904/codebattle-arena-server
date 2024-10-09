import { ApiProperty } from '@nestjs/swagger';

export class SwaggerExceptionDto {
  @ApiProperty({ required: true, description: 'Is Succeed', example: false })
  success: boolean;

  @ApiProperty({ required: true, description: 'Response Message' })
  message: string;
}
