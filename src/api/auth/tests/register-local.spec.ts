import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';

describe('Register Local', () => {
  before(initSequelize);

  it('Creates an account', () =>
    request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'test' })
      .expect(200)
      .then((response) => {
        expect(response.body.username).to.equal('test');
        expect(response.body.token).to.not.be.null;
        expect(response.body.id).to.not.be.null;
      }));

  it('Cannot create an account with existing username', () =>
    request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'test' })
      .expect(400));
});
