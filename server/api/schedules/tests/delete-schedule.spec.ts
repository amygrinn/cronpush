import request from 'supertest'

import app from '~/app'
import { initSequelize } from '~/models'
import { Auth, PushSubscriptions, Schedules } from '~/test-utils'

describe('Delete schedule', () => {
  let token: string
  let scheduleIds: string[]
  before(async () => {
    await initSequelize()
    token = await Auth.init()
    await PushSubscriptions.init(token)
    scheduleIds = await Schedules.init(token)
  })

  it('Deletes a schedule without a user', done => {
    request(app)
      .delete('/schedules/' + scheduleIds[0])
      .expect(200, done)
  })
  
  it('Does not delete a schedule with a user if token not provider', done => {
    request(app)
      .delete('/schedules/' + scheduleIds[1])
      .expect(401, done)
  })

  it('Deletes a schedule with a user', done => {
    request(app)
      .delete('/schedules/' + scheduleIds[1])
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done)
  })
})
