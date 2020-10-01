import { RequestHandler, Response } from 'express';
import { pushSubscriptions } from '../../models';

const createPushSubscription: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  if (
    !req.body.endpoint ||
    !req.body.keys ||
    !req.body.keys.p256dh ||
    !req.body.keys.auth ||
    !req.body.timeZone
  ) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const pushSubscription: pushSubscriptions.PushSubscription = {
    endpoint: req.body.endpoint,
    keys: {
      p256dh: req.body.keys.p256dh,
      auth: req.body.keys.auth,
    },
    timeZone: req.body.timeZone,
    userId: req.user ? req.user.id : undefined,
    enabled: req.body.enabled !== false,
  };

  // let pushSubscription = await pushSubscriptions.find(req.body.endpoint);
  if (await pushSubscriptions.exists(req.body.endpoint)) {
    return res.status(400).json({ error: 'Push subscription already exists' });
  }

  await pushSubscriptions.create(pushSubscription);

  return res.json(pushSubscriptions.sanitize(pushSubscription));
};

export default createPushSubscription;
