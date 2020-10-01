export default interface PushSubscription {
  enabled: boolean;
  userId?: string;
  endpoint: string;
  timeZone: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}
