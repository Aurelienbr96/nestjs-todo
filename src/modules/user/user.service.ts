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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateRefreshToken(id: number, uuid: string) {
    return this.prisma.user.update({ where: { id }, data: { refresh: uuid } });
  }

  async findByRefresh(uuid: string, userId: number) {
    return this.prisma.user.findFirst({ where: { refresh: uuid, id: userId } });
  }
}
