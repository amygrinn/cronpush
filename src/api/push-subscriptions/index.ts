import { Router } from 'express';
import createPushSubscription from './create-push-subscription';
import getPushSubscription from './get-push-subscription';
import patchPushSubscription from './patch-push-subscription';

const pushRouter = Router();

pushRouter.get('/vapid-public-key', (req, res) => {
  res.set('Content-Type', 'text/plain');
  return res.send(process.env.VAPID_PUBLIC_KEY as string);
});
pushRouter.get('/', getPushSubscription);
pushRouter.post('/', createPushSubscription);
pushRouter.patch('/', patchPushSubscription);

export default pushRouter;
