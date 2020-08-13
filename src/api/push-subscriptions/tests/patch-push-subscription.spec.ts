import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth, PushSubscriptions } from 'src/test-utils';

describe('Patch push subscription', () => {
  let token: string;
  before(async () => {
    await initSequelize();
    token = await Auth.init();
    await PushSubscriptions.init(token);
  });

  it('Disables a subscription', (done) => {
    request(app)
      .patch('/push')
      .send({
        endpoint: PushSubscriptions.ENDPOINT,
        enabled: false,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.endpoint).to.equal(PushSubscriptions.ENDPOINT);
        expect(response.body.enabled).to.be.false;
        expect(response.body.id).to.not.be.null;
        done();
      });
  });

  it('Enables a subscription', (done) => {
    request(app)
      .patch('/push')
      .send({
        endpoint: PushSubscriptions.ENDPOINT,
        enabled: true,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.endpoint).to.equal(PushSubscriptions.ENDPOINT);
        expect(response.body.enabled).to.be.true;
        expect(response.body.id).to.not.be.null;
        done();
      });
  });

  it('Adds a user to a subscription', (done) => {
    request(app)
      .patch('/push')
      .set('Authorization', `Bearer ${token}`)
      .send({ endpoint: 'endpoint' })
      .expect(200)
      .then((response) => {
        expect(response.body.user).to.not.be.null;
        done();
      });
  });
});
