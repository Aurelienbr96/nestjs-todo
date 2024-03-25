import { User, Role } from '@prisma/client';

type UserFixtureContent = Omit<User, 'id' | 'refresh'>;

export class UserFixtures {
  static get account() {
    const user: UserFixtureContent = {
      email: 'aurel@gmail.com',
      password: 'testpassword',
      role: Role.USER,
    };
    const create: UserFixtureContent = {
      email: 'create@gmail.com',
      password: 'createPassword',
      role: Role.USER,
    };
    return { user, create };
  }

  static get stored() {
    const user: User = {
      ...UserFixtures.account.user,
      id: 1,
      password: '$2a$12$RXR2mRaLOKXVM4xRm2IK8OG20CCRRp9zpz32D9mph9musUJKQiqcm',
      refresh: '1eb9bdd1-51fe-4aae-a45f-52f6f73bf20f',
    };
    const all = [user];
    return { user, all };
  }
}
