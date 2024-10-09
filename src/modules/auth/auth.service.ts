import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private auth: Auth;

  constructor(private configService: ConfigService) {
    // Admin SDK 초기화
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert('./firebase-adminsdk.json'),
      });
    }

    // Client SDK 초기화
    const firebaseConfig = {
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
    };
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }

  async createUser(
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> {
    await admin.auth().createUser({
      email,
      password,
      displayName,
    });
  }

  async getUserProfile(uid: string): Promise<admin.auth.UserRecord> {
    return await admin.auth().getUser(uid);
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();
      return token;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            throw new UnauthorizedException('User not found');
          case 'auth/wrong-password':
            throw new UnauthorizedException('Invalid password');
          default:
            throw new UnauthorizedException('Login failed');
        }
      }
      throw new UnauthorizedException('Unexpected error during login');
    }
  }
}
