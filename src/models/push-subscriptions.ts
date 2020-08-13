import * as Sequelize from 'sequelize';

import { Users } from './users';
import type { Schedules } from './schedules';
import type { Notifications } from './notifications';

export class PushSubscriptions extends Sequelize.Model {
  public id!: string;

  public userId!: string;

  public enabled!: boolean;

  public endpoint!: string;

  public p256dh!: string;

  public auth!: string;

  public timeZone!: string;

  public schedules !: Schedules[] | undefined;

  public user!: Users | undefined;

  public notifications !: Notifications[] | undefined;

  public sanitized() {
    return {
      id: this.id,
      endpoint: this.endpoint,
      enabled: this.enabled,
      user: this.user ? this.user.id : undefined,
      timeZone: this.timeZone,
    };
  }

  public getUser!: () => Promise<Users | void>;

  public setUser!: (user: Users) => Promise<void>;

  public getSchedules!: (options?: Sequelize.FindOptions) => Promise<Schedules[]>;

  public addSchedule!: (schedule: Schedules, options?: Object) => Promise<void>;
}

const definition = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    noUpdate: true,
  },
  userId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  endpoint: {
    type: Sequelize.STRING,
    allowNull: false,
    noUpdate: true,
  },
  p256dh: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  auth: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  timeZone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default (sequelize: Sequelize.Sequelize) => {
  PushSubscriptions.init(definition, { sequelize, modelName: 'push_subscriptions' });
  PushSubscriptions.belongsTo(Users, { foreignKey: 'userId' });
  Users.hasMany(PushSubscriptions, { as: { singular: 'PushSubscription', plural: 'PushSubscriptions' } });
};
