import { RequestHandler } from 'express';
import passport from 'passport';

export default (required: boolean): RequestHandler => (req, res, next) =>
  passport.authenticate(['jwt'], { session: false }, (error, user) => {
    if (required && error) {
      return res.status(401).json({ error });
    }

    req.user = user;
    next();
  })(req, res, next);
