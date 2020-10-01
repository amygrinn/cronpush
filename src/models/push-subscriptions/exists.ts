import * as db from '../db';

export default async (endpoint: string): Promise<boolean> => {
  const [{ pushSubscriptionExists }] = await db.query(
    `
      SELECT COUNT(*) AS pushSubscriptionExists
      FROM push_subscriptions
      WHERE endpoint = :endpoint
    `,
    { endpoint }
  );

  return !!pushSubscriptionExists;
};
