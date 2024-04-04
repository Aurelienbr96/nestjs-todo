import { MuscleGroup } from '@prisma/client';

export class MuscleGroupFixtures {
  static generate(partial: Partial<MuscleGroup> & Pick<MuscleGroup, 'id'>): MuscleGroup {
    const { id, ...muscleGroup } = partial;
    return {
      id,
      name: 'chest',
      description: 'pectoral muscle',
      ...muscleGroup,
    };
  }
}
