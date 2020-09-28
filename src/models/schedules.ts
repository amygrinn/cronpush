import * as Sequelize from 'sequelize';
import type { Notifications } from './notifications';
import { PushSubscriptions } from './push-subscriptions';
import { Users } from './users';

export class ScheduleSubscriptions extends Sequelize.Model {
  public enabled!: boolean;

  public notifications!: Notifications[] | undefined;

  public schedule!: Schedules | undefined;

  public pushSubscription!: PushSubscriptions | undefined;

  public scheduleId!: string;
}

export class Schedules extends Sequelize.Model {
  public id!: string;

  public userId!: string;

  public message!: string;

  public cronExpression!: string;

  public pushSubscriptions!: PushSubscriptions[];

  public user!: Users | undefined;

  public enabled!: boolean | undefined;

  public title!: string;

  public icon!: string;

  public schedule_subscriptions!: { enabled: boolean } | undefined;

  public getUser!: () => Promise<Users | undefined>;

  public setUser!: (user: Users) => Promise<void>;

  public getPushSubscriptions!: (
    options?: Sequelize.FindOptions
  ) => Promise<PushSubscriptions[]>;

  public addPushSubscription!: (
    pushSubscription: PushSubscriptions,
    options?: Object
  ) => Promise<void>;

  public sanitized() {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      icon: this.icon,
      cronExpression: this.cronExpression,
      enabled: this.schedule_subscriptions
        ? this.schedule_subscriptions.enabled
        : false,
      user: this.user ? this.user.id : undefined,
    };
  }
}

const schedulesDefinition = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  cronExpression: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const scheduleSubscriptionsDefinition = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
};

export default (sequelize: Sequelize.Sequelize) => {
  Schedules.init(schedulesDefinition, { sequelize, modelName: 'schedules' });
  Schedules.belongsTo(Users, { foreignKey: 'userId' });
  ScheduleSubscriptions.init(scheduleSubscriptionsDefinition, {
    sequelize,
    modelName: 'schedule_subscriptions',
  });
  Schedules.belongsToMany(PushSubscriptions, {
    through: ScheduleSubscriptions,
    as: { singular: 'pushSubscription', plural: 'pushSubscriptions' },
  });
  ScheduleSubscriptions.belongsTo(Schedules);
  ScheduleSubscriptions.belongsTo(PushSubscriptions, {
    foreignKey: 'pushSubscriptionId',
    as: 'pushSubscription',
  });
  PushSubscriptions.belongsToMany(Schedules, {
    through: ScheduleSubscriptions,
  });
};
