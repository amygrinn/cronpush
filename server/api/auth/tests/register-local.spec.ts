import { expect } from 'chai'
import request from 'supertest'

import app from '~/app'
import { initSequelize } from '~/models'

describe('Register Local', () => {
  before(initSequelize)

  it('Creates an account', done => {
    request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'test' })
      .expect(200)
      .then(response => {
        expect(response.body.username).to.equal('test')
        expect(response.body.token).to.not.be.null
        expect(response.body.id).to.not.be.null
        done()
      })
  })

  it('Cannot create an account with existing username', done => {
    request(app)
      .post('/auth/register')
      .send({ username: 'test', password: 'test' })
      .expect(400, done)
  })
})
