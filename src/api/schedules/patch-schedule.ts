import { RequestHandler, Response } from 'express';

import { Schedules, PushSubscriptions, Users } from 'src/models';
import { removeFutureNotifications } from 'src/notifications';

const patchSchedule: RequestHandler = async (req, res): Promise<Response> => {
  const schedule = await Schedules.findOne({
    where: { id: req.params.scheduleId },
    include: [Users],
  });

  if (!schedule) {
    return res.status(404).send({ error: 'Schedule does not exist' });
  }

  if (!schedule.user || (req.user && schedule.user.equals(req.user))) {
    await schedule.update(req.body.schedule);
    await removeFutureNotifications(schedule.id);
  }

  if (!schedule.user && req.user) {
    await schedule.setUser(req.user);
  }

  if (
    req.body.push
    && req.body.push.endpoint
  ) {
    const pushSubscription = await PushSubscriptions.findOne({
      where: { endpoint: req.body.push.endpoint },
    });

    if (!pushSubscription) {
      return res.status(404).send({ error: 'Push subscription does not exist' });
    }

    await schedule.addPushSubscription(
      pushSubscription,
      {
        through: {
          enabled: req.body.schedule.enabled,
        },
      },
    );
    schedule.schedule_subscriptions = { enabled: req.body.schedule.enabled };
  }

  return res.json(schedule.sanitized());
};

export default patchSchedule;
