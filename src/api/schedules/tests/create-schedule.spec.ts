import { expect } from 'chai';
import request from 'supertest';
import app from '../../../app';
import { init } from '../../../models';
import { Auth, PushSubscriptions } from '../../../test-utils';

describe('Create schedule', () => {
  let token: string;
  before(() =>
    init()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
  );

  it('Creates a schedule w/o login', () =>
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
      }));

  it('Creates a schedule w/ login', () =>
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
      }));
});
