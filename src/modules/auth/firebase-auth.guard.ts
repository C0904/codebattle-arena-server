import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = await this.authService.verifyToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      return false;
    }
  }
}
