import createNotifications from './create-notifications';
import removeFutureNotifications from './remove-future-notifications';
import sendNotifications from './send-notifications';

export { removeFutureNotifications };

const send = async () => {
  const now = new Date();
  now.setSeconds(0, 0);
  await createNotifications(new Date(now.getTime()));
  await sendNotifications(new Date(now.getTime()));
};

const scheduler = () => {
  send();

  const nextMinute = new Date();
  nextMinute.setSeconds(60, 0);
  const delay = nextMinute.getTime() - new Date().getTime();

  setTimeout(scheduler, delay);
};

export default scheduler;
