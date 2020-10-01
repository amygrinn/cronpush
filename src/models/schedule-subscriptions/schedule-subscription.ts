export default interface ScheduleSubscription {
  id: string;
  pushSubscriptionId: string;
  scheduleId: string;
  enabled: boolean;
  endpoint: string;
}
