import { Injectable } from '@nestjs/common';

import { PrismaService } from '../common';

import { MuscleToCreateDTO, MuscleToUpdateDTO } from './dto';

@Injectable()
export class MuscleGroupService {
  constructor(private prisma: PrismaService) {}
  async create(muscle: MuscleToCreateDTO) {
    return this.prisma.muscleGroup.create({ data: muscle });
  }

  async findUnique(id: number) {
    return this.prisma.muscleGroup.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.muscleGroup.findMany();
  }

  async update(id: number, data: MuscleToUpdateDTO) {
    return this.prisma.muscleGroup.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.muscleGroup.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return this.prisma.muscleGroup.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
