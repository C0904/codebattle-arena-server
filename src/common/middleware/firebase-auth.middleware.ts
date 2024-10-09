import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      // throw new UnauthorizedException('No token provided');
      req['user'] = null;
      next();
    } else {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req['user'] = decodedToken;
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
