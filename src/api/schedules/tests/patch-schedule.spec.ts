import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth, PushSubscriptions, Schedules } from 'src/test-utils';

describe('Patch a schedule', () => {
  let token: string;
  let scheduleIds: string[];
  before(async () => {
    await initSequelize();
    token = await Auth.init();
    await PushSubscriptions.init(token);
    scheduleIds = await Schedules.init(token);
  });

  it('Updates a schedule without a user', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.equal('new message');
        expect(response.body.cronExpression).to.equal('*/10 * * * * *');
        done();
      });
  });

  it('Cannot update schedule with user without token', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[1]}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.not.equal('new message');
        expect(response.body.cronExpression).to.not.equal('*/10 * * * * *');
        done();
      });
  });

  it('Updates a schedule with user with token', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.equal('new message');
        expect(response.body.cronExpression).to.equal('*/10 * * * * *');
        done();
      });
  });

  it('Adds a push subscription to schedule', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        push: {
          endpoint: PushSubscriptions.USER_ENDPOINT,
        },
        schedule: {
          enabled: true,
        },
      })
      .expect(200)
      .then(() => {
        request(app)
          .get('/schedules')
          .query({ endpoint: PushSubscriptions.USER_ENDPOINT })
          .expect(200)
          .then((response) => {
            expect(response.body.schedules).to.have.length(2);
            done();
          });
      });
  });

  it('Disables a schedule without a user', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        schedule: {
          enabled: false,
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.enabled).to.be.false;
        done();
      });
  });

  it('Disables a schedule with a user without a token', (done) => {
    request(app)
      .patch(`/schedules/${scheduleIds[1]}`)
      .send({
        schedule: {
          enabled: false,
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.enabled).to.be.false;
        done();
      });
  });
});
