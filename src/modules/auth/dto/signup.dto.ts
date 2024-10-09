import { Is } from '@app/common/decorator/is.decorator';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @Is('string', true, '이메일')
  email: string;

  @Is('string', true, '비밀번호')
  @MinLength(6)
  password: string;

  @Is('string', true, '닉네임')
  @MaxLength(12)
  displayName: string;
}
