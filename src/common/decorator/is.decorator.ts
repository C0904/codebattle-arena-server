import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export function Is(
  type: 'number' | 'string' | 'numberString' | 'boolean' | 'array',
  required: boolean,
  description: string,
): PropertyDecorator {
  return applyDecorators(
    required ? IsNotEmpty() : IsOptional(),
    getValidatorByType(type),
    ApiProperty({
      description,
      required,
    }),
  );
}

function getValidatorByType(
  type: 'number' | 'string' | 'numberString' | 'boolean' | 'array',
): PropertyDecorator {
  if (type === 'number') {
    return IsNumber();
  } else if (type === 'string') {
    return IsString();
  } else if (type === 'boolean') {
    return IsBoolean();
  } else if (type === 'numberString') {
    return IsNumberString();
  } else {
    return IsArray();
  }
}
