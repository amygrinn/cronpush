import { RequestHandler } from 'express'

import { PushSubscriptions } from '~/models'

const getSchedules: RequestHandler = async (req, res) => {
  if (!req.query.endpoint) {
    return res.status(400).json({ error: 'Bad Request' })
  }
  
  const pushSubscription = await PushSubscriptions.findOne({ where: { endpoint: req.query.endpoint as string }})

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push Subscription does not exist' })
  }

  const schedules = await pushSubscription.getSchedules()

  if (req.user) {
    const pushSubscriptions =
      (await req.user.getPushSubscriptions())
        .filter(sub => !sub.equals(pushSubscription))

    for (let i = 0; i < pushSubscriptions.length; i++) {
      const disabledSchedules = await pushSubscriptions[i].getSchedules()
      schedules.push(...disabledSchedules.map(s => {
        s.schedule_subscriptions = { enabled: false }
        return s
      }))
    }
  }

  return res.json({ schedules: schedules.map(s => s.sanitized())})
}

export default getSchedules
