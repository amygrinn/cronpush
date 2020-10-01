/* eslint-disable eqeqeq */
/* eslint-disable complexity */
import { RequestHandler, Response } from 'express';
import { notifications, schedules, scheduleSubscriptions } from '../../models';

const patchSchedule: RequestHandler = async (req, res): Promise<Response> => {
  const schedule = await schedules.find(req.params.scheduleId);

  if (!schedule) {
    return res.status(404).send({ error: 'Schedule does not exist' });
  }

  let scheduleSubscription:
    | scheduleSubscriptions.ScheduleSubscription
    | undefined;

  if (req.body.push && req.body.push.endpoint) {
    scheduleSubscription = await scheduleSubscriptions.find(
      req.body.push.endpoint,
      req.params.scheduleId
    );
  }

  if (!schedule.userId && req.user) {
    schedule.userId = req.user.id;
  }

  const authorized =
    !schedule.userId || (req.user && req.user.id === schedule.userId);

  if (authorized) {
    if (req.body.schedule) {
      const shouldRecreateNotifications =
        req.body.schedule.cronExpression &&
        req.body.schedule.cronExpression !== schedule.cronExpression;

      schedule.cronExpression =
        req.body.schedule.cronExpression || schedule.cronExpression;
      schedule.title = req.body.schedule.title || schedule.title;
      schedule.icon = req.body.schedule.icon || schedule.icon;
      schedule.message = req.body.schedule.message || schedule.message;

      await schedules.update(schedule);
      if (shouldRecreateNotifications) await notifications.destroy(schedule.id);
    }

    if (req.body.push && req.body.push.endpoint) {
      if (!scheduleSubscription) {
        await scheduleSubscriptions.create(
          req.body.push.endpoint,
          schedule.id,
          req.body.enabled !== false
        );
      } else if (req.body.enabled != scheduleSubscription.enabled) {
        scheduleSubscription.enabled = req.body.enabled;
        await scheduleSubscriptions.update(scheduleSubscription);
      }
    }
  } else if (scheduleSubscription && req.body.enabled === false) {
    scheduleSubscription.enabled = false;
    await scheduleSubscriptions.update(scheduleSubscription);
  } else {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  schedule.enabled = scheduleSubscription && scheduleSubscription.enabled;

  return res.json(schedule);
};

export default patchSchedule;
