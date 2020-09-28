import * as Sequelize from 'sequelize';
import type { PushSubscriptions } from './push-subscriptions';

export interface User {
  id?: string;
  username: string;
  password: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Users extends Sequelize.Model {
  public id!: string;

  public username!: string;

  public password!: string;

  public token!: string;

  public toJSON!: () => User;

  public getPushSubscriptions!: (
    options?: Sequelize.FindOptions
  ) => Promise<PushSubscriptions[]>;

  public sanitized() {
    return {
      id: this.id,
      username: this.username,
      token: this.token,
    };
  }
}

const definition = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

export default (sequelize: Sequelize.Sequelize) => {
  Users.init(definition, { sequelize, modelName: 'users' });
};
