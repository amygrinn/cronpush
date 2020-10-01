import { RequestHandler } from 'express';
import { pushSubscriptions, scheduleSubscriptions } from '../../models';

const getSchedules: RequestHandler = async (req, res) => {
  if (!req.query.endpoint || typeof req.query.endpoint !== 'string') {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pushSubscription = await pushSubscriptions.find(req.query.endpoint);

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push Subscription does not exist' });
  }

  const schedules = await scheduleSubscriptions.findSchedules({
    endpoint: req.query.endpoint,
    userId: req.user ? req.user.id : undefined,
  });

  return res.json({ schedules });
};

export default getSchedules;
