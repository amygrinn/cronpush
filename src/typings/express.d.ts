/* eslint-disable @typescript-eslint/no-empty-interface */
import { Users } from '../models';

declare global {
  namespace Express {
    interface User extends Users {}
  }
}
