import { RequestHandler, Response } from 'express';
import { pushSubscriptions } from '../../models';

const patchPushSubscription: RequestHandler = async (
  req,
  res
): Promise<Response> => {
  if (!req.body.endpoint) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pushSubscription = await pushSubscriptions.find(req.body.endpoint);

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push subscription not found' });
  }

  if (!pushSubscription.userId && req.user) {
    pushSubscription.userId = req.user.id;
  }

  const authorized =
    !pushSubscription.userId ||
    (req.user && req.user.id === pushSubscription.userId);

  if (authorized) {
    if ('enabled' in req.body) pushSubscription.enabled = req.body.enabled;
    pushSubscription.timeZone = req.body.timeZone || pushSubscription.timeZone;
  } else if (req.body.enabled === false) {
    // Always allow turning off notifications even when signed out
    pushSubscription.enabled = false;
  } else {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await pushSubscriptions.update(pushSubscription);
  return res.json(pushSubscriptions.sanitize(pushSubscription));
};

export default patchPushSubscription;
