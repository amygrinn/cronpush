import { RequestHandler, Response } from 'express';
import { pushSubscriptions } from '../../models';

const getPushSubscription: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  if (!req.query.endpoint || typeof req.query.endpoint !== 'string') {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pushSubscription = await pushSubscriptions.find(req.query.endpoint);

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Subscription does not exist' });
  }

  return res.json(pushSubscriptions.sanitize(pushSubscription));
};

export default getPushSubscription;
