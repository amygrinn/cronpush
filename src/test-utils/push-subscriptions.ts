import request from 'supertest';
import app from '../app';

export const ENDPOINT = 'endpoint';
export const USER_ENDPOINT = 'user-endpoint';

export const init = async (token: string): Promise<void> => {
  await request(app)
    .post('/push')
    .send({
      endpoint: ENDPOINT,
      keys: {
        p256dh: 'test-p256dh',
        auth: 'test-auth',
      },
      timeZone: 'America/New_York',
    });

  await request(app)
    .post('/push')
    .set('Authorization', `Bearer ${token}`)
    .send({
      endpoint: USER_ENDPOINT,
      keys: {
        p256dh: 'test-p256dh',
        auth: 'test-auth',
      },
      timeZone: 'America/New_York',
    });
};
