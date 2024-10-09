import { ApiProperty } from '@nestjs/swagger';

export class ResCommonDto {
  @ApiProperty({ required: true, description: 'is succeed', example: true })
  success: boolean;
}
