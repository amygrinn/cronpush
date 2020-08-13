import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth } from 'src/test-utils';

describe('Create push subscription', () => {
  let token: string;
  before(async () => {
    await initSequelize();
    token = await Auth.init();
  });

  it('Creates a new subscription w/o login', (done) => {
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
        done();
      });
  });

  it('Creates a new subscription w/ login', (done) => {
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
        done();
      });
  });
});
