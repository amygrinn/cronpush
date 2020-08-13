import { expect } from 'chai';
import request from 'supertest';

import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';

describe('Get schedules', () => {
  let token: string;
  before(() => initSequelize()
    .then(Auth.init).then((t) => { token = t; })
    .then(() => PushSubscriptions.init(token))
    .then(() => Schedules.init(token)));

  it(
    'Gets schedule by endpoint',
    () => request(app)
      .get('/schedules')
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.schedules).to.have.length(1);
        expect(response.body.schedules[0].enabled).to.be.true;
      }),
  );

  it(
    'Gets schedules by endpoint and user',
    () => request(app)
      .get('/schedules')
      .set('Authorization', `Bearer ${token}`)
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.schedules).to.have.length(2);
      }),
  );
});
