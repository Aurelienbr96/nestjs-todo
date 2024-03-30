import { INestApplication } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/modules';

type UserFixtureContent = Omit<User, 'id' | 'refresh'>;

export class UserFixtures {
  static get account() {
    const user: UserFixtureContent = {
      email: 'aurel@gmail.com',
      password: 'testpassword',
      role: Role.USER,
    };
    const admin: UserFixtureContent = {
      email: 'admin@admin.com',
      password: 'adminpassword',
      role: Role.ADMIN,
    };
    const create: UserFixtureContent = {
      email: 'create@gmail.com',
      password: 'createPassword',
      role: Role.USER,
    };
    return { user, create, admin };
  }

  static get stored() {
    const user: User = {
      ...UserFixtures.account.user,
      id: 1,
      password: '$2a$12$RXR2mRaLOKXVM4xRm2IK8OG20CCRRp9zpz32D9mph9musUJKQiqcm',
      refresh: '1eb9bdd1-51fe-4aae-a45f-52f6f73bf20f',
    };

    const admin: User = {
      ...UserFixtures.account.admin,
      id: 2,
      password: '$2a$10$i9A3F0wmcojx1qaiNgAHtevkokFGBWIMsH.Q5GQi2b3MWbC6mD1gm',
      refresh: '049bc5f1-91a6-404c-addb-d00069275bae',
    };
    const all = [user, admin];
    return { user, all, admin };
  }

  static async generateRefreshCookie(app: INestApplication, userId: number) {
    const auth = app.get(AuthService);
    const prisma = app.get(PrismaService);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`Unable to find user with id ${userId}`);

    const refreshToken = auth.signRefreshToken(user.id, user.refresh);
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
      ...user,
    };
  }

  static async hashPasswords(users: User[]) {
    const hash = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    const passwords = await Promise.all(users.map((user) => hash(user.password)));

    return users.map((user, i) => ({ ...user, password: passwords[i] }));
  }
}
