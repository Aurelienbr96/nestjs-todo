import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../common';

import { TrainingToCreateDTO } from './dto/training-to-create.dto';

@Injectable()
export class TrainingService {
  constructor(private prisma: PrismaService) {}
  async findByPage(page: number) {
    const [training, count] = await Promise.all([
      this.prisma.training.findMany({
        skip: Math.max(10 * (page - 1), 0),
        take: 10,
        include: {
          exercises: {
            select: {
              exercise: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.training.count(),
    ]);
    const pages = Math.ceil(count / 10);
    return { training, pages };
  }

  async create(training: TrainingToCreateDTO) {
    const result = await this.prisma.$transaction(async (tx) => {
      const createdTraining = await tx.training.create({
        data: {
          name: training.name,
          description: training.description,
          exercises: {
            create: training.exercises.map((ex) => ({
              exerciseId: ex.id,
              sets: {
                create: ex.sets.map((set) => ({
                  weight: set.weight,
                  rest: set.rest,
                  reps: set.reps,
                })),
              },
            })),
          },
        },
      });
      return this.findUnique(createdTraining.id, tx);
    });
    return result;
  }

  findUnique(id: number, tx: Prisma.TransactionClient) {
    const queryClient = tx || this.prisma;
    return queryClient.training.findUnique({
      include: {
        exercises: {
          select: {
            sets: {
              select: { rest: true, weight: true, reps: true },
            },
            exercise: {
              select: { id: true, name: true, description: true },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
