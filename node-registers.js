require('ts-node/register');
require('tsconfig-paths/register');

let defaultEnv = {
  PORT: '8080',
  NODE_ENV: 'development',
  JWT_SECRET: 'shhh',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  MYSQL_USER: 'root',
  MYSQL_PASSWORD: 'password',
  MYSQL_DB: 'cron-push',
  MYSQL_TEST_DB: 'cron-push-test',
  VAPID_PUBLIC_KEY: 'BKzhfJrg1uY9Tn1rMx3OLRx7Bq4khJs1VRJxSNhFRGTdtLk0p4oVLRJvRoI-HjmV43uPPSB9vZjlHWNN1WAelOg',
  VAPID_PRIVATE_KEY: 'FxnKvASKejfrVOZTx-SSJVXUnKUInsu4sM19kU-VDNY',
};

process.env = Object.assign({}, defaultEnv, process.env);

require('dotenv').config();
