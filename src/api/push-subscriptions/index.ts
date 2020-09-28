import { Router } from 'express';
import createPushSubscriptionHandler from './create-push-subscription';
import getPushSubscription from './get-push-subscription';
import patchPushSubscription from './patch-push-subscription';

const pushRouter = Router();

pushRouter.get('/', getPushSubscription);
pushRouter.post('/', createPushSubscriptionHandler);
pushRouter.patch('/', patchPushSubscription);

export default pushRouter;
