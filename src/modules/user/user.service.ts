import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { PrismaService } from '../common';
import { UserToRegisterDTO } from '../auth';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(userToRegister: UserToRegisterDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userToRegister.password, salt);
    return this.prisma.user.create({
      data: { ...userToRegister, password: hashedPassword },
    });
  }
}
