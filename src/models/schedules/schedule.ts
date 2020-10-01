export default interface Schedule {
  id: string;
  cronExpression: string;
  title: string;
  icon: string;
  message?: string;
  userId?: string;
  enabled?: boolean;
}
