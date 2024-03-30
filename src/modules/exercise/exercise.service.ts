import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../common';

import { ExerciseToCreateDTO, ExerciseToUpdateDTO } from './dto';
import { flattenExercise } from './utils';

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}
  async findByPage(page: number) {
    const [exercises, count] = await Promise.all([
      this.prisma.exercise.findMany({
        skip: Math.max(10 * (page - 1), 0),
        take: 10,
        include: {
          muscleGroups: {
            select: this.getMuscleGroupSelect(),
          },
        },
      }),
      this.prisma.exercise.count(),
    ]);
    const pages = Math.ceil(count / 10);
    return { exercises, pages };
  }

  async findUnique(id: number, tx?: Prisma.TransactionClient) {
    const queryClient = tx || this.prisma;
    return queryClient.exercise.findUnique({
      where: { id },
      include: {
        muscleGroups: {
          select: this.getMuscleGroupSelect(),
        },
      },
    });
  }

  getMuscleGroupSelect() {
    return {
      muscleGroup: {
        select: {
          id: true,
        },
      },
    };
  }

  async create({ name, description, muscleGroupIds, userId }: ExerciseToCreateDTO) {
    const result = await this.prisma.$transaction(async (tx) => {
      const exercise = await tx.exercise.create({
        data: {
          name: name,
          description: description,
          ...(userId && { createdBy: { connect: { id: userId } } }),
        },
      });

      await tx.exerciseMuscleGroup.createMany({
        data: muscleGroupIds.map((muscleGroupId) => ({
          exerciseId: exercise.id,
          muscleGroupId: muscleGroupId,
        })),
      });

      return this.findUnique(exercise.id, tx);
    });
    return result;
  }

  async update(id: number, { muscleGroupIds: newMuscleGroupIds, description, name }: ExerciseToUpdateDTO) {
    const result = await this.prisma.$transaction(async (tx) => {
      const actualExercise = await this.findUnique(id);
      if (!actualExercise) throw new NotFoundException(`Exercise ID ${id} have not been found.`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const oldMuscleGroupIds: number[] = flattenExercise(actualExercise).muscleGroups;

      const toBeAdded = newMuscleGroupIds.filter((id) => !oldMuscleGroupIds.includes(id));

      const toBeRemoved = oldMuscleGroupIds.filter((id) => !newMuscleGroupIds.includes(id));

      await tx.exercise.update({
        data: {
          name,
          description,
        },
        where: {
          id,
        },
      });

      await tx.exerciseMuscleGroup.createMany({
        data: toBeAdded.map((muscleGroupId) => {
          return {
            exerciseId: id,
            muscleGroupId,
          };
        }),
      });

      await tx.exerciseMuscleGroup.deleteMany({
        where: {
          exerciseId: id,
          muscleGroupId: {
            in: toBeRemoved,
          },
        },
      });

      return this.findUnique(id, tx);
    });
    return result;
  }

  async delete(id: number) {
    const result = await this.prisma.$transaction(async (tx) => {
      const actualExercise = await this.findUnique(id);
      if (!actualExercise) throw new NotFoundException(`Exercise ID ${id} have not been found.`);
      await tx.exerciseMuscleGroup.deleteMany({
        where: {
          exerciseId: id,
        },
      });

      return tx.exercise.delete({
        where: {
          id,
        },
      });
    });
    return result;
  }
}
