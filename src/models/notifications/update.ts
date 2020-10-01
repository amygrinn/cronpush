import * as db from '../db';
import Notification from './notification';

export default (notification: Notification) =>
  db.query(
    `
    UPDATE notifications
    SET sent = :sent
    WHERE id = :id
  `,
    {
      id: notification.id,
      sent: Number(notification.sent),
    }
  );
