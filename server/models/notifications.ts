import * as Sequelize from 'sequelize'

import { Users } from './users'
import { ScheduleSubscriptions } from './schedules'

export class Notifications extends Sequelize.Model {
  public id!: string
  public sent!: boolean
  public date!: Date
  public title!: string
  public message!: string
  public icon!: string
  public scheduleSubscription!: ScheduleSubscriptions | undefined
  public user!: Users | undefined
  public setScheduleSubscription!: (scheduleSubscription: ScheduleSubscriptions, options?: Object ) => Promise<void>
}

const notificationsDefinition: Sequelize.ModelAttributes = {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  sent: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  date: {
    type: 'DATETIME',
    allowNull: false,
  },
}

export default (sequelize: Sequelize.Sequelize) => {
  Notifications.init(notificationsDefinition, { sequelize, modelName: 'notifications' })
  Notifications.belongsTo(ScheduleSubscriptions, { as: 'scheduleSubscription' })
  ScheduleSubscriptions.hasMany(Notifications)
}
