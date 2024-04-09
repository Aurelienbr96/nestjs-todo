import { INestApplication } from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/modules';

export class UserFixtures {
  static async generateRefreshCookie(app: INestApplication, userId: number) {
    const auth = app.get(AuthService);
    const prisma = app.get(PrismaService);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`Unable to find user with id ${userId}`);

    const refreshToken = auth.signRefreshToken(user.id, user.refresh as string);
    return `refresh-token=${refreshToken}`;
  }

  static async generateAccessCookie(app: INestApplication, userId: number) {
    const auth = app.get(AuthService);
    const prisma = app.get(PrismaService);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`Unable to find user with id ${userId}`);

    const accessToken = auth.signAccessToken(user.id, user.email, user.role);
    return `access-token=${accessToken}`;
  }

  static generate(partial: Partial<User> & Pick<User, 'id'>): User {
    const { id, ...user } = partial;
    return {
      id,
      email: `user-${id}@company.com`,
      password: `userpassword-${id}`,
      refresh: `refresh-${id}`,
      role: 'USER',
      googleId: null,
      ...user,
    };
  }

  static async hashPasswords(users: User[]) {
    const hash = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    const passwords = await Promise.all(users.map((user) => hash(user.password as string)));

    return users.map((user, i) => ({ ...user, password: passwords[i] }));
  }
}
