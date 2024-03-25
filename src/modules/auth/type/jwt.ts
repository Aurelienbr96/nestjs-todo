import { Role } from '@prisma/client';

export type JWTPayload<T> = T & {
  exp: number;
  iat: number;
};

export type AuthPayload = { sub: number; role: Role };

export type RefreshPayload = { sub: string; userId: number };
