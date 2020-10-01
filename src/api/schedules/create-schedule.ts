import { RequestHandler } from 'express';
import {
  pushSubscriptions,
  schedules,
  scheduleSubscriptions,
} from '../../models';

const createSchedule: RequestHandler = async (req, res) => {
  if (
    !req.body.push ||
    !req.body.push.endpoint ||
    !req.body.schedule ||
    !req.body.schedule.cronExpression ||
    !req.body.schedule.title
  ) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  if (!(await pushSubscriptions.exists(req.body.push.endpoint))) {
    return res.status(404).json({ error: 'Push subscription does not exist' });
  }

  const schedule = await schedules.create({
    cronExpression: req.body.schedule.cronExpression,
    title: req.body.schedule.title,
    icon: req.body.schedule.icon,
    message: req.body.schedule.message,
    userId: req.user && req.user.id,
  });

  schedule.enabled = req.body.enabled !== false;

  await scheduleSubscriptions.create(
    req.body.push.endpoint,
    schedule.id,
    schedule.enabled
  );

  return res.json(schedule);
};

export default createSchedule;
