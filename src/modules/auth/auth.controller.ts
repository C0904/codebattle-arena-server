import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { GetDecodedToken } from '@app/common/decorator/get-access-token.decorator';
import { TokenPayload } from '@app/common/interface/token-payload.interface';
import { GetProfile } from './decorators/get-profile';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { email, password, displayName } = signUpDto;
    return await this.authService.createUser(email, password, displayName);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const token = await this.authService.login(email, password);
    return { token };
  }

  @GetProfile()
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@GetDecodedToken() token: TokenPayload) {
    return {
      name: token.name,
      email: token.email,
    };
  }
}
