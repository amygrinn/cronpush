import request from 'supertest';
import app from '../app';
import * as PushSubscriptions from './push-subscriptions';

export const init = async (token: string) => {
  const allScheduleId = await request(app)
    .post('/schedules')
    .send({
      push: {
        endpoint: PushSubscriptions.ENDPOINT,
      },
      schedule: {
        cronExpression: '* * * * *',
        title: 'Title',
        message: 'message',
        icon: '/icons/star.png',
        enabled: true,
      },
    })
    .then((response) => response.body.id);

  const evenScheduleId = await request(app)
    .post('/schedules')
    .set('Authorization', `Bearer ${token}`)
    .send({
      push: {
        endpoint: PushSubscriptions.USER_ENDPOINT,
      },
      schedule: {
        cronExpression: '*/2 * * * *',
        title: 'Title',
        message: 'message',
        icon: '/icons/star.png',
        enabled: true,
      },
    })
    .then((response) => response.body.id);

  return [allScheduleId, evenScheduleId];
};

export default init;
