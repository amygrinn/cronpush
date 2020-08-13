import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth, PushSubscriptions } from 'src/test-utils';

describe('Get push subscription', () => {
  let token: string;
  before(async () => {
    await initSequelize();
    token = await Auth.init();
    await PushSubscriptions.init(token);
  });

  it('Gets a push subscription w/o user', (done) => {
    request(app)
      .get('/push')
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.enabled).to.not.be.null;
        expect(response.body.endpoint).to.equal(PushSubscriptions.ENDPOINT);
        done();
      });
  });

  it('Gets a push subscription w/ user', (done) => {
    request(app)
      .get('/push')
      .query({ endpoint: PushSubscriptions.USER_ENDPOINT })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.enabled).to.not.be.null;
        expect(response.body.endpoint).to.equal(PushSubscriptions.USER_ENDPOINT);
        expect(response.body.user).to.not.be.null;
        done();
      });
  });
});
