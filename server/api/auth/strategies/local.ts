import { Strategy as LocalStrategy, VerifyFunction } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { Users } from '~/models'

export const register = new LocalStrategy(async (username, password, done) => {
  if (await Users.findOne({ where: { username } })) {
    return done('User already exists')
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await Users.create({ username, password: hash })

  jsonwebtoken.sign(
    user.sanitized(),
    process.env.JWT_SECRET as string,
    (err: Error, token: string) => {
      user.token = token
      done(err, user)
    }
  )
})

export const login = new LocalStrategy(async (username, password, done) => {
  const user = await Users.findOne({ where: { username } })

  if (!user) {
    return done('User does not exist')
  }

  if (!await bcrypt.compare(password, user.password)) {
    return done('Incorrect password')
  }

  jsonwebtoken.sign(
    user.sanitized(),
    process.env.JWT_SECRET as string,
    (err: Error, token: any) => {
      user.token = token
      done(err, user)
    }
  )
})

export const jwt = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    const user = await Users.findOne({ where: { id: payload.id } })
    if (!user) {
      done(new Error('User does not exist'))
    }
    done(null, user)
  }
)
