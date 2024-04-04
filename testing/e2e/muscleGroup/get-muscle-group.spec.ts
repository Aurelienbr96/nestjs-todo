import request from 'supertest';
import { PublicMuscleGroupModel } from 'src/modules/muscleGroup/type/MuscleGroup';

import { SuperTestResponse } from '../../types';
import { E2EUtils } from '../E2EUtils';

describe('GET /muscle-group', () => {
  it('return a list of muscle group', () => {
    return request(E2EUtils.server)
      .get('/muscle-group')
      .send()
      .expect(200)
      .then((response: SuperTestResponse<PublicMuscleGroupModel>) => {
        expect(response.body).toEqual('hey');
      });
  });
});
