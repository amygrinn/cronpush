import * as notifications from './notifications';
import * as pushSubscriptions from './push-subscriptions';
import * as scheduleSubscriptions from './schedule-subscriptions';
import * as schedules from './schedules';
import * as users from './users';

export const init = () =>
  Promise.all([
    users.init(),
    pushSubscriptions.init(),
    schedules.init(),
    scheduleSubscriptions.init(),
    notifications.init(),
  ]);

export {
  notifications,
  pushSubscriptions,
  schedules,
  scheduleSubscriptions,
  users,
};
