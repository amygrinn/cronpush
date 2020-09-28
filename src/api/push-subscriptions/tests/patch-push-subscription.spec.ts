import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth, PushSubscriptions } from '../../../test-utils';

describe('Patch push subscription', () => {
  let token: string;
  before(() =>
    initSequelize()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
  );

  it('Disables a subscription', () =>
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
      }));

  it('Enables a subscription', () =>
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
      }));

  it('Adds a user to a subscription', () =>
    request(app)
      .patch('/push')
      .set('Authorization', `Bearer ${token}`)
      .send({ endpoint: 'endpoint' })
      .expect(200)
      .then((response) => {
        expect(response.body.user).to.not.be.null;
      }));
});
