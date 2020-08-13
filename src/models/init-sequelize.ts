import * as Sequelize from 'sequelize';

import sequelizeNoUpdateAttributes from 'sequelize-noupdate-attributes';

import initUsers from './users';
import initPushSubscriptions from './push-subscriptions';
import initSchedules from './schedules';
import initNotifications from './notifications';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initSequelize: () => Promise<void> = async () => {
  const sequelize = new Sequelize.Sequelize(
    process.env.NODE_ENV === 'test'
      ? process.env.MYSQL_TEST_DB as string
      : process.env.MYSQL_DB as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      dialect: 'mysql',
      logging: false,
    },
  );

  sequelizeNoUpdateAttributes(sequelize);

  initUsers(sequelize);
  initPushSubscriptions(sequelize);
  initSchedules(sequelize);
  initNotifications(sequelize);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.sync({ force: process.env.NODE_ENV === 'test' });
      break;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Cannot connect to database. Retrying in 5 seconds');
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
    }
  }
};

export default initSequelize;
