export interface TokenPayload {
  name: string;
  auth_time: number;
  iat: number;
  exp: number;
  email: string;
  emailVerified: boolean;
}
