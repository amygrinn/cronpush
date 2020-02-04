import * as Sequelize from 'sequelize'

import sequelizeNoUpdateAttributes from 'sequelize-noupdate-attributes'

import initUsers from './users'
import initPushSubscriptions from './push-subscriptions'
import initSchedules from './schedules'
import initNotifications from './notifications'

export const initSequelize: () => Promise<void> = async () => {
  const sequelize = new Sequelize.Sequelize(
    process.env.NODE_ENV === 'test'
        ? process.env.MYSQL_TEST_DB as string
        : process.env.MYSQL_DB as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: false,
    }
  )

  sequelizeNoUpdateAttributes(sequelize)

  initUsers(sequelize)
  initPushSubscriptions(sequelize)
  initSchedules(sequelize)
  initNotifications(sequelize)

  await sequelize.sync({ force: process.env.NODE_ENV === 'test' })
}
