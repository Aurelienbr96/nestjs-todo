import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common';

@Injectable()
export class UserToCoachService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, coachId: number) {
    return this.prisma.userToCoach.create({
      data: {
        userId,
        coachId,
      },
    });
  }
}
