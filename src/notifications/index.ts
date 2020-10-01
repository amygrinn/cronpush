import { notifications } from '../models';
import onTheMinute from './on-the-minute';
import sendNotifications from './send-notifications';

export default () =>
  onTheMinute(() => notifications.createNecessary().then(sendNotifications));
