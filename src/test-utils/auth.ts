import request from 'supertest';

import app from 'src/app';

export const USERNAME = 'test';
export const PASSWORD = 'test';

export const init = () => new Promise<string>((resolve) => {
  request(app)
    .post('/auth/register')
    .send({ username: USERNAME, password: PASSWORD })
    .then((response) => {
      resolve(response.body.token);
    });
});
