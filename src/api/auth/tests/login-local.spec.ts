import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth } from '../../../test-utils';

describe('Login Local', () => {
  before(() => initSequelize().then(Auth.init));

  it('Logs in to test account', () =>
    request(app)
      .post('/auth/login')
      .send({ username: Auth.USERNAME, password: Auth.PASSWORD })
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.username).to.equal('test');
        expect(response.body.token).to.not.be.null;
      }));

  it('Cannot login with wrong password', () =>
    request(app)
      .post('/auth/login')
      .send({ username: Auth.USERNAME, password: 'wrong' })
      .expect(400));
});
