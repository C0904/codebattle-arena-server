import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../interface/token-payload.interface';

export const GetDecodedToken = createParamDecorator(
  (data, ctx: ExecutionContext): TokenPayload => {
    const req = ctx.switchToHttp().getRequest();

    if (!req?.user) return null;

    const userInfo = {
      name: req.user.name,
      email: req.user.email,
      emailVerified: req.user.email_verified,
      auth_time: req.user.auth_time,
      iat: req.user.iat,
      exp: req.user.exp,
    };

    return userInfo as TokenPayload;
  },
);
