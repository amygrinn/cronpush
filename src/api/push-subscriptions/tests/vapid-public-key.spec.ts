import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { initSequelize } from '../../../models';

describe('Get vapid public key', () => {
  before(initSequelize);

  it('Gets the current key', () => {
    process.env.VAPID_PUBLIC_KEY = 'test key!';
    return request(app)
      .get('/push/vapid-public-key')
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('test key!');
      });
  });
});
