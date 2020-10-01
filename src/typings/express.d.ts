/* eslint-disable @typescript-eslint/no-empty-interface */
import { User as MyUser } from '../models/users';

declare global {
  namespace Express {
    interface User extends MyUser {}
  }
}
