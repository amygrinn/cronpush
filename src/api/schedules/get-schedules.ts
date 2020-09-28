import { RequestHandler } from 'express';
import { PushSubscriptions, Schedules } from '../../models';

const getSchedules: RequestHandler = async (req, res) => {
  if (!req.query.endpoint) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const pushSubscription = await PushSubscriptions.findOne({
    where: { endpoint: req.query.endpoint as string },
  });

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push Subscription does not exist' });
  }

  const schedules = await pushSubscription.getSchedules();

  if (req.user) {
    const pushSubscriptions: PushSubscriptions[] = (
      await req.user.getPushSubscriptions()
    ).filter((sub) => !sub.equals(pushSubscription));

    const disabledSchedules = ([] as Schedules[]).concat(
      ...(await Promise.all(pushSubscriptions.map((sub) => sub.getSchedules())))
    );

    schedules.push(
      ...disabledSchedules.map((s) => {
        // eslint-disable-next-line no-param-reassign
        s.schedule_subscriptions = { enabled: false };
        return s;
      })
    );
  }

  return res.json({ schedules: schedules.map((s) => s.sanitized()) });
};

export default getSchedules;
