import { expect } from 'chai'
import request from 'supertest'

import app from '~/app'
import { initSequelize } from '~/models'
import { Auth, PushSubscriptions, Schedules } from '~/test-utils'

describe('Get schedules', () => {
  let token: string
  before(async () => {
    await initSequelize()
    token = await Auth.init()
    await PushSubscriptions.init(token)
    await Schedules.init(token)
  })

  it('Gets schedule by endpoint', done => {
    request(app)
      .get('/schedules')
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then(response => {
        expect(response.body.schedules).to.have.length(1)
        expect(response.body.schedules[0].enabled).to.be.true
        done()
      })
  })

  it('Gets schedules by endpoint and user', done => {
    request(app)
      .get('/schedules')
      .set('Authorization', 'Bearer ' + token)
      .query({ endpoint: PushSubscriptions.ENDPOINT })
      .expect(200)
      .then(response => {
        expect(response.body.schedules).to.have.length(2)
        done()
      })
  })
})
