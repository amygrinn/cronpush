import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { initSequelize, Notifications } from '../../models';
import { Auth, PushSubscriptions, Schedules } from '../../test-utils';
import createNotifications from '../create-notifications';

chai.use(sinonChai);

describe('Create notifications', () => {
  let token: string;
  const now = new Date();
  let createNotificationSpy: sinon.SinonSpy;

  before(() =>
    initSequelize()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
      .then(() => Schedules.init(token))
  );

  beforeEach(() => {
    createNotificationSpy = sinon.spy(Notifications, 'create');
  });

  afterEach(sinon.restore);

  it('Creates notifications for all schedules', async () => {
    await createNotifications(now);
    expect(createNotificationSpy).to.have.been.calledTwice;
  });

  // it('It does not recreate notifications if they already exist in the future', async () => {
  //   const now = new Date();
  //   await createNotifications(now);
  //   expect(createNotificationSpy).to.have.not.been.called;
  // });
});
