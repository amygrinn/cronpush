import { RequestHandler } from 'express'

import { PushSubscriptions, Users } from '~/models'

const patchPushSubscription: RequestHandler = async (req, res) => {
  if (
    !req.body.endpoint
  ) {
    return res.status(400).json({ error: 'Bad Request' })
  }

  let pushSubscription = await PushSubscriptions.findOne({
    where: { endpoint: req.body.endpoint },
    include: [Users]
  })

  if (!pushSubscription) {
    return res.status(404).json({ error: 'Push subscription not found' })
  }

  if (!pushSubscription.user || (req.user && pushSubscription.user.equals(req.user))) {
    await pushSubscription.update(req.body)
  } else if (req.body.enabled !== undefined) {
    await pushSubscription.update({ enabled: req.body.enabled })
  }

  if (req.user) {
    await pushSubscription.setUser(req.user)
  }

  res.json(pushSubscription.sanitized())
}

export default patchPushSubscription
