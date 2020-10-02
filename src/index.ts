import app from './app';
import { init } from './models';
import startNotifications from './notifications';

init().then(() => {
  startNotifications();
  const { PORT } = process.env;
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
