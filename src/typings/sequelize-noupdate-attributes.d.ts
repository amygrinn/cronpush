declare module 'sequelize-noupdate-attributes' {
  import { Sequelize } from 'sequelize';

  const init: (Sequelize: Sequelize) => void;
  export default init;
}
