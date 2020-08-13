// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Users } from 'src/models';

declare global {
  namespace Express {
    interface User extends Users { }
  }
}
