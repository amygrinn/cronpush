// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users } from 'src/models';

declare global {
  namespace Express {
    // eslint-disable-next-line import/prefer-default-export
    export class User extends Users { }
  }
}
