import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth } from 'src/test-utils';

describe('Login Local', () => {
  before(() => initSequelize().then(Auth.init));

  it('Logs in to test account', (done) => {
    request(app)
      .post('/auth/login')
      .send({ username: Auth.USERNAME, password: Auth.PASSWORD })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.username).to.equal('test');
        expect(response.body.token).to.not.be.null;
        done();
      });
  });

  it('Cannot login with wrong password', (done) => {
    request(app)
      .post('/auth/login')
      .send({ username: Auth.USERNAME, password: 'wrong' })
      .expect(400, done);
  });
});
