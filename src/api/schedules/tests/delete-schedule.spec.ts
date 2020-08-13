import request from 'supertest';

import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';

describe('Delete schedule', () => {
  let token: string;
  let scheduleIds: string[];
  before(() => initSequelize()
    .then(Auth.init).then((t) => { token = t; })
    .then(() => PushSubscriptions.init(token))
    .then(() => Schedules.init(token).then((ids) => { scheduleIds = ids; })));

  it(
    'Deletes a schedule without a user',
    () => request(app)
      .delete(`/schedules/${scheduleIds[0]}`)
      .expect(200),
  );

  it(
    'Does not delete a schedule with a user if token not provider',
    () => request(app)
      .delete(`/schedules/${scheduleIds[1]}`)
      .expect(401),
  );

  it(
    'Deletes a schedule with a user',
    () => request(app)
      .delete(`/schedules/${scheduleIds[1]}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200),
  );
});
