import { Users } from '~/models'

declare global {
  namespace Express {
    class User extends Users {}
  }
}
