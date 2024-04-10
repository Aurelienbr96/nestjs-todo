import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import { PrismaService } from '../common';
import { UserToRegisterDTO } from '../auth';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashpassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(userToRegister: UserToRegisterDTO) {
    const hashedPassword = await this.hashpassword(userToRegister.password);
    return this.prisma.user.create({
      data: { ...userToRegister, password: hashedPassword },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        refresh: true,
      },
    });
  }

  async deleteOne(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async updateOne(userToUpdate: Partial<Omit<User, 'id'>>, id: number) {
    try {
      if (userToUpdate.password) {
        const hashedPassword = await this.hashpassword(userToUpdate.password);
        Object.assign(userToUpdate, { password: hashedPassword });
      }

      return this.prisma.user.update({
        data: userToUpdate,
        where: { id },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async createFromGoogle(userFromGoogle: { email: string; googleId: string }) {
    return this.prisma.user.create({
      data: userFromGoogle,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByReferalCode(referalCode: string) {
    return this.prisma.user.findUnique({ where: { referalCode } });
  }

  async updateRefreshToken(id: number, uuid: string) {
    return this.prisma.user.update({ where: { id }, data: { refresh: uuid } });
  }

  async findByRefresh(uuid: string, userId: number) {
    return this.prisma.user.findFirst({ where: { refresh: uuid, id: userId } });
  }

  async resetRefreshToken(userId: number): Promise<void> {
    await this.prisma.user.update({ data: { refresh: null }, where: { id: userId } });
  }
}
