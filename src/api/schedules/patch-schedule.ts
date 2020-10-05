import { RequestHandler } from 'express';
import {
  notifications,
  pushSubscriptions,
  schedules,
  scheduleSubscriptions,
} from '../..//models';
import { Schedule } from '../../models/schedules';

interface PatchScheduleBody {
  schedule: Partial<Schedule>;
  push: { endpoint: string };
  enabled: boolean;
}

const constrain = (body: any): PatchScheduleBody | never => {
  // prettier-signore
  if (
    !body.push ||
    !body.push.endpoint ||
    body.enabled === null ||
    body.enabled === undefined
  ) {
    throw new Error('Incorrect body');
  }

  if (!body.schedule) body.schedule = {};

  return {
    schedule: {
      cronExpression: body.schedule.cronExpression,
      title: body.schedule.title,
      icon: body.schedule.icon,
      message: body.schedule.message,
      userId: body.schedule.userId,
    },
    push: { endpoint: body.push.endpoint },
    enabled: !!body.enabled,
  };
};

const patchSchedule: RequestHandler = async (req, res) => {
  const { scheduleId } = req.params;

  let body: PatchScheduleBody;
  try {
    body = constrain(req.body);
  } catch (err) {
    return res.sendStatus(400);
  }

  let schedule = await schedules.find(scheduleId);
  if (!schedule) return res.sendStatus(404);

  const pushSubscription = await pushSubscriptions.find(body.push.endpoint);
  if (!pushSubscription) return res.sendStatus(404);

  const authorized =
    !schedule.userId || (req.user && req.user.id === schedule.userId);

  let scheduleSubscription = await scheduleSubscriptions.find(
    body.push.endpoint,
    scheduleId
  );

  let recreateNotifications = false;
  let updateSchedule = false;
  let updateScheduleSubscription = false;

  if (authorized) {
    if (!scheduleSubscription) {
      scheduleSubscription = await scheduleSubscriptions.create(
        body.push.endpoint,
        scheduleId,
        body.enabled
      );
    } else if (body.enabled !== scheduleSubscription.enabled) {
      scheduleSubscription.enabled = body.enabled;
      updateScheduleSubscription = true;
    }

    recreateNotifications =
      body.schedule.cronExpression !== schedule.cronExpression;

    for (const key in body.schedule) {
      const k = key as keyof Schedule;
      if (body.schedule[k] !== undefined) {
        updateSchedule = true;
        schedule[k] = body.schedule[k] as never;
      }
    }
  } else if (!body.enabled && scheduleSubscription) {
    // Always allow notifications to be turned off
    scheduleSubscription.enabled = false;
    recreateNotifications = true;
    updateScheduleSubscription = true;
  } else {
    return res.sendStatus(403);
  }

  if (!recreateNotifications && !updateSchedule && !updateScheduleSubscription)
    return res.sendStatus(400); // No action taken

  const promises: Promise<any>[] = [];
  if (recreateNotifications) promises.push(notifications.destroy(scheduleId));
  if (updateSchedule) promises.push(schedules.update(schedule));
  if (updateScheduleSubscription)
    promises.push(scheduleSubscriptions.update(scheduleSubscription));

  await Promise.all(promises);

  schedule.enabled = pushSubscription.enabled && scheduleSubscription.enabled;

  return res.json(schedule);
};

export default patchSchedule;
