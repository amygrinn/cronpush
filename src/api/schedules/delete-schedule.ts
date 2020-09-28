import { RequestHandler } from 'express';
import { Schedules, Users } from '../../models';

const deleteSchedule: RequestHandler = async (req, res) => {
  const schedule = await Schedules.findOne({
    where: { id: req.params.scheduleId },
    include: [Users],
  });

  if (!schedule) {
    return res.status(404).json({ error: 'Schedule does not exist' });
  }

  if (schedule.user && (!req.user || !schedule.user.equals(req.user))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await schedule.destroy();

  return res.sendStatus(200);
};

export default deleteSchedule;
