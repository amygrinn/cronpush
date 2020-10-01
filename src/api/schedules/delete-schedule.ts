import { RequestHandler } from 'express';
import { schedules } from '../../models';

const deleteSchedule: RequestHandler = async (req, res) => {
  const schedule = await schedules.find(req.params.scheduleId);

  if (!schedule) {
    return res.status(404).json({ error: 'Schedule does not exist' });
  }

  if (schedule.userId && (!req.user || req.user.id !== schedule.userId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await schedules.destroy(req.params.scheduleId);

  return res.sendStatus(200);
};

export default deleteSchedule;
