import { expect } from 'chai';
import request from 'supertest';

import app from 'src/app';
import { initSequelize } from 'src/models';
import { Auth, PushSubscriptions } from 'src/test-utils';

describe('Create schedule', () => {
  let token: string;
  before(async () => {
    await initSequelize();
    token = await Auth.init();
    await PushSubscriptions.init(token);
  });

  it('Creates a schedule w/o login', (done) => {
    request(app)
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
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.title).to.equal('Title');
        expect(response.body.message).to.equal('message');
        expect(response.body.icon).to.equal('/icons/star.png');
        expect(response.body.cronExpression).to.equal('* * * * * *');
        expect(response.body.enabled).to.be.true;
        done();
      });
  });

  it('Creates a schedule w/ login', (done) => {
    request(app)
      .post('/schedules')
      .set('Authorization', `Bearer ${token}`)
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
      .expect(200)
      .then((response) => {
        expect(response.body.id).to.not.be.null;
        expect(response.body.title).to.equal('Title');
        expect(response.body.message).to.equal('message');
        expect(response.body.icon).to.equal('/icons/star.png');
        expect(response.body.cronExpression).to.equal('* * * * * *');
        expect(response.body.enabled).to.be.true;
        expect(response.body.user).to.not.be.null;
        done();
      });
  });
});
