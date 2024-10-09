import { Is } from '@app/common/decorator/is.decorator';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Is('string', true, '이메일')
  email: string;

  @Is('string', true, '비밀번호')
  @MinLength(6)
  password: string;
}
