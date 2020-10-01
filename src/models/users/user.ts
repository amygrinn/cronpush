export default interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  password: string;
  token?: string;
}
