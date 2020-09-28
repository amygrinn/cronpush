import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth, PushSubscriptions } from '../../../test-utils';

describe('Get push subscription', () => {
  let token: string;
  before(() =>
    initSequelize()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
  );

  it('Gets a push subscription w/o user', () =>
    request(app)
      .get('/push')
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.enabled).to.not.be.null;
        expect(response.body.endpoint).to.equal(PushSubscriptions.ENDPOINT);
      }));

  it('Gets a push subscription w/ user', () =>
    request(app)
      .get('/push')
      .query({ endpoint: PushSubscriptions.USER_ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.enabled).to.not.be.null;
        expect(response.body.endpoint).to.equal(
          PushSubscriptions.USER_ENDPOINT
        );
        expect(response.body.user).to.not.be.null;
      }));
});
