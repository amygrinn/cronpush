import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { init } from '../../../models';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';

describe('Patch a schedule', () => {
  let token: string;
  let scheduleIds: string[];
  before(() =>
    init()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
      .then(() =>
        Schedules.init(token).then((ids) => {
          scheduleIds = ids;
        })
      )
  );

  it('Updates a schedule without a user', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
        push: {
          endpoint: PushSubscriptions.ENDPOINT,
        },
        enabled: true,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.equal('new message');
        expect(response.body.cronExpression).to.equal('*/10 * * * * *');
        expect(response.body.enabled).to.be.true;
      }));

  it('Cannot update schedule with user without token', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[1]}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
        push: {
          endpoint: PushSubscriptions.USER_ENDPOINT,
        },
        enabled: true,
      })
      .expect(403));

  it('Adds a push subscription to schedule', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        push: {
          endpoint: PushSubscriptions.USER_ENDPOINT,
        },
        enabled: true,
      })
      .then(() =>
        request(app)
          .get('/schedules')
          .query({ endpoint: PushSubscriptions.USER_ENDPOINT })
          .expect(200)
          .then((response) => {
            expect(response.body.schedules).to.have.length(2);
          })
      ));

  it('Updates a schedule with user with token', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        schedule: {
          message: 'new message',
          cronExpression: '*/10 * * * * *',
        },
        enabled: true,
        push: {
          endpoint: PushSubscriptions.USER_ENDPOINT,
        },
      })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.equal('new message');
        expect(response.body.cronExpression).to.equal('*/10 * * * * *');
        expect(response.body.enabled).to.be.true;
      }));

  it('Disables a schedule without a user', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[0]}`)
      .send({
        push: {
          endpoint: PushSubscriptions.ENDPOINT,
        },
        enabled: false,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.enabled).to.be.false;
      }));

  it('Disables a schedule with a user without a token', () =>
    request(app)
      .patch(`/schedules/${scheduleIds[1]}`)
      .send({
        push: {
          endpoint: PushSubscriptions.USER_ENDPOINT,
        },
        enabled: false,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.enabled).to.be.false;
      }));
});
