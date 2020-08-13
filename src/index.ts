import app from './app';
import initSequelize from './models';
import startNotifications from './notifications';

initSequelize().then(() => {
  startNotifications();
  const PORT = process.env.API_PORT;
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
