import { RequestHandler, Response } from 'express';
import { notifications, schedules, scheduleSubscriptions } from '../../models';

const patchSchedule: RequestHandler = async (req, res): Promise<Response> => {
  const schedule = await schedules.find(req.params.scheduleId);

  if (!schedule) {
    return res.status(404).send({ error: 'Schedule does not exist' });
  }

  let actionPerformed = false;

  const authorized =
    !schedule.userId || (req.user && req.user.id === schedule.userId);

  if (req.body.push && req.body.push.endpoint) {
    const scheduleSubscription = await scheduleSubscriptions.find(
      req.body.push.endpoint,
      req.params.scheduleId
    );

    if (!scheduleSubscription) {
      await scheduleSubscriptions.create(
        req.body.push.endpoint,
        schedule.id,
        req.body.enabled !== false
      );
    } else if (
      // eslint-disable-next-line eqeqeq
      req.body.enabled != scheduleSubscription.enabled &&
      (authorized || !req.body.enabled) // Must be authorized to turn on, can turn off w/o signing in
    ) {
      scheduleSubscription.enabled = req.body.enabled;
      schedule.enabled = req.body.enabled;
      await scheduleSubscriptions.update(scheduleSubscription);
      actionPerformed = true;
    }
  }

  if (authorized && req.body.schedule) {
    const shouldRecreateNotifications =
      req.body.schedule.cronExpression &&
      req.body.schedule.cronExpression !== schedule.cronExpression;

    schedule.cronExpression =
      req.body.schedule.cronExpression || schedule.cronExpression;
    schedule.title = req.body.schedule.title || schedule.title;
    schedule.icon = req.body.schedule.icon || schedule.icon;
    schedule.message = req.body.schedule.message || schedule.message;
    if (req.user) {
      schedule.userId = req.user.id;
    }

    await schedules.update(schedule);
    if (shouldRecreateNotifications) await notifications.destroy(schedule.id);
    actionPerformed = true;
  }

  if (actionPerformed) {
    return res.json(schedule);
  }

  return res.sendStatus(400);
};

export default patchSchedule;
