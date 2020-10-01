import chai, { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { init } from '../..';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';
import * as create from '../create';

chai.use(sinonChai);

describe('Create necessary notifications', () => {
  let token: string;
  let createSpy: sinon.SinonSpy;
  let createNecessaryNotifications: typeof import('../create-necessary').default;
  const now = new Date();

  before(() =>
    init()
      .then(Auth.init)
      .then((t: string) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
      .then(() => Schedules.init(token))
  );

  beforeEach(() => {
    createSpy = sinon.spy(create, 'default');
    createNecessaryNotifications = proxyquire('../create-necessary', {
      create,
    }).default;
  });

  afterEach(sinon.restore);

  it('Creates notifications for all schedules', async () => {
    await createNecessaryNotifications(now);
    expect(createSpy).to.have.been.calledOnce;
    expect(createSpy.getCall(0).args[0]).has.length(2);
  });

  it('It does not recreate notifications if they already exist in the future', async () => {
    await createNecessaryNotifications(now);
    expect(createSpy).to.not.have.been.called;
  });
});
