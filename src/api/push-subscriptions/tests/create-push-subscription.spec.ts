import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth } from '../../../test-utils';

describe('Create push subscription', () => {
  let token: string;
  before(() =>
    initSequelize()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
  );

  it('Creates a new subscription w/o login', () =>
    request(app)
      .post('/push')
      .send({
        endpoint: 'endpoint',
        keys: {
          p256dh: 'test-p256dh',
          auth: 'test-auth',
        },
        timeZone: 'America/New_York',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.endpoint).to.equal('endpoint');
        expect(response.body.timeZone).to.equal('America/New_York');
        expect(response.body.enabled).to.be.true;
      }));

  it('Creates a new subscription w/ login', () =>
    request(app)
      .post('/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        endpoint: 'user-endpoint',
        keys: {
          p256dh: 'test-p256dh',
          auth: 'test-auth',
        },
        timeZone: 'America/New_York',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.endpoint).to.equal('user-endpoint');
        expect(response.body.timeZone).to.equal('America/New_York');
        expect(response.body.enabled).to.be.true;
        expect(response.body.user).to.not.be.null;
      }));
});
