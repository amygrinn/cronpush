import { RequestHandler, Response } from 'express';
import { PushSubscriptions, Users } from '../../models';

const getPushSubscription: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  if (!req.query.endpoint) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pushSubscription = await PushSubscriptions.findOne({
    where: { endpoint: req.query.endpoint as string },
    include: [Users],
  });
  if (!pushSubscription) {
    return res.status(404).json({ error: 'Subscription does not exist' });
  }

  return res.json(pushSubscription.sanitized());
};

export default getPushSubscription;
