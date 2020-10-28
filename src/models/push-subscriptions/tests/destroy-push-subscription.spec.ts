import { expect } from 'chai';
import { init } from '../..';
import { Auth, PushSubscriptions, Schedules } from '../../../test-utils';
import * as db from '../../db';
import destroyPushSubscription from '../destroy';

describe('Destroy a push subscription', () => {
  let subscriptionIds: string[] = [];
  let token: string;
  before(() =>
    init()
      .then(Auth.init)
      .then((t) => {
        token = t;
      })
      .then(() => PushSubscriptions.init(token))
      .then(() =>
        db.useConnection(async (query) => {
          subscriptionIds.push(
            (
              await query<{ id: string }>(
                `SELECT id FROM push_subscriptions WHERE endpoint = "${PushSubscriptions.ENDPOINT}"`
              )
            )[0].id
          );
          subscriptionIds.push(
            (
              await query<{ id: string }>(
                `SELECT id FROM push_subscriptions WHERE endpoint = "${PushSubscriptions.USER_ENDPOINT}"`
              )
            )[0].id as string
          );
        })
      )
      .then(() => Schedules.init(token))
  );

  it('Destroys all schedule_subscriptions and a push subscription from an endpoint', async () => {
    await destroyPushSubscription(PushSubscriptions.ENDPOINT);
    let sss = await db.query(
      `SELECT * FROM schedule_subscriptions WHERE pushSubscriptionId = "${subscriptionIds[0]}"`
    );
    expect(sss).to.have.length(0);
    sss = await db.query(
      `SELECT * FROM schedule_subscriptions WHERE pushSubscriptionId = "${subscriptionIds[1]}"`
    );
    expect(sss).to.have.length(1);
  });
});
