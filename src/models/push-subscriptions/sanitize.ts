import PushSubscription from './push-subscription';

type SanitizedPushSubscription = Omit<PushSubscription, 'keys'>;

export default (
  pushSubscription: PushSubscription
): SanitizedPushSubscription => ({
  endpoint: pushSubscription.endpoint,
  enabled: pushSubscription.enabled,
  userId: pushSubscription.userId,
  timeZone: pushSubscription.timeZone,
});
