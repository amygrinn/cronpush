import request from 'supertest';

import app from '../app';
import * as PushSubscriptions from './push-subscriptions';

export const init = async (token: string) => {
  const ids: string[] = [];
  await request(app)
    .post('/schedules')
    .send({
      push: {
        endpoint: PushSubscriptions.ENDPOINT,
      },
      schedule: {
        cronExpression: '* * * * * *',
        title: 'Title',
        message: 'message',
        icon: '/icons/star.png',
        enabled: true,
      },
    })
    .then((response) => ids.push(response.body.id));

  await request(app)
    .post('/schedules')
    .set('Authorization', `Bearer ${token}`)
    .send({
      push: {
        endpoint: PushSubscriptions.USER_ENDPOINT,
      },
      schedule: {
        cronExpression: '* * * * * *',
        title: 'Title',
        message: 'message',
        icon: '/icons/star.png',
        enabled: true,
      },
    })
    .then((response) => ids.push(response.body.id));

  return ids;
};

export default init;
