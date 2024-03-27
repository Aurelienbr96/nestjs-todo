import { MuscleGroup } from '@prisma/client';

type MuscleGroupContent = Omit<MuscleGroup, 'id'>;

type MuscleGroupUpdate = Omit<MuscleGroup, 'id' | 'description'>;

export class MuscleGroupFixtures {
  static get muscleGroup() {
    const create: MuscleGroupContent = {
      name: 'Chest',
      description: 'The chest is separated between 3 muscle group',
    };

    return { create };
  }

  static get stored() {
    const muscleGroup: MuscleGroup = {
      ...MuscleGroupFixtures.muscleGroup.create,
      id: 1,
    };
    const all = [muscleGroup];
    return { muscleGroup, all };
  }

  static get updateName() {
    const muscleGroup: MuscleGroupUpdate = {
      name: 'Shoulder',
    };

    return { name: muscleGroup.name };
  }

  static get updateNameWithWrongParams() {
    const muscleGroup: MuscleGroupUpdate & { otherParams: string } = {
      name: 'Shoulder',
      otherParams: 'string',
    };

    return { muscleGroup };
  }
}
