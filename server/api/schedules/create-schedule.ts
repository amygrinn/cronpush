import { RequestHandler } from 'express'

import { Schedules, PushSubscriptions } from '~/models'

const createSchedule: RequestHandler = async (req, res) => {
  if (
    !req.body.push
    || !req.body.push.endpoint
    || !req.body.schedule
    || !req.body.schedule.cronExpression
    || req.body.schedule.enabled === undefined
  ) {
    return res.status(400).json({ error: 'Bad Request' })
  }

  if(req.body.schedule.hasOwnProperty('id')) {
    delete req.body.schedule.id
  }

  const pushSubscription = await PushSubscriptions.findOne({ where: { endpoint: req.body.push.endpoint }})
  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push subscription does not exist' })
  }

  const schedule = await Schedules.create(req.body.schedule)

  schedule.addPushSubscription(pushSubscription, { through: { enabled: req.body.schedule.enabled }})

  schedule.schedule_subscriptions = { enabled: req.body.schedule.enabled }

  if (req.user) {
    schedule.setUser(req.user)
  }

  return res.json(schedule.sanitized())
}

export default createSchedule
