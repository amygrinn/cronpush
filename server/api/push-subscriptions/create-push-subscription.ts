import { RequestHandler } from 'express'

import { PushSubscriptions, Users } from '~/models'

const createPushSubscription: RequestHandler = async (req, res) => {
  if (
    !req.body.endpoint
    || !req.body.keys
    || !req.body.keys.p256dh
    || !req.body.keys.auth
    || !req.body.timeZone
  ) {
    return res.status(400).json({ error: 'Bad request' })
  }

  let pushSubscription = await PushSubscriptions.findOne({ where: { endpoint: req.body.endpoint } })
  if (pushSubscription) {
    return res.status(400).json({ error: 'Push subscription already exists' })
  }

  const payload = {
    endpoint: req.body.endpoint,
    p256dh: req.body.keys.p256dh,
    auth: req.body.keys.auth,
    timeZone: req.body.timeZone,
  }

  pushSubscription = await PushSubscriptions.create(payload, { include: [Users] })

  if (req.user) {
    pushSubscription.setUser(req.user)
  }
  
  res.json(pushSubscription.sanitized())
}

export default createPushSubscription
