import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';
import { Auth } from '../../../test-utils';

describe('Verify by JWT', () => {
  let token: string;
  before(() =>
    initSequelize()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
  );

  it('Get user information using token', () =>
    request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.username).to.equal('test');
      }));
});
