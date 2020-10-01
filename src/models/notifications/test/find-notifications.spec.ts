import { expect } from 'chai';
import * as notifications from '..';
import { init } from '../..';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';

describe('Finds notifications to be sent', () => {
  let token: string;

  before(() =>
    init()
      .then(Auth.init)
      .then((t: string) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
      .then(() => Schedules.init(token))
  );

  it('Finds both notifications if minutes are even', async () => {
    const now = new Date();
    now.setMinutes(28);
    await notifications.createNecessary(now);
    const result = await notifications.find(now);
    expect(result).to.have.length(2);
  });
});
