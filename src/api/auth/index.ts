import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import passport from 'passport';
import * as local from './strategies/local';

passport.use('register-local', local.register);
passport.use('login-local', local.login);
passport.use('jwt', local.jwt);

// eslint-disable-next-line max-len
export const verify = (required: boolean): RequestHandler => (req, res, next) =>
  passport.authenticate(
    ['jwt'],
    { session: false },
    // eslint-disable-next-line consistent-return
    (error, user) => {
      if (required && error) {
        return res.status(401).json({ error });
      }

      req.user = user;
      next();
    }
  )(req, res, next);

export const router = Router();

router.post(
  '/register',
  passport.authenticate(['register-local'], {
    session: false,
    failWithError: true,
  }),
  ((req, res) => res.json((req.user as any).sanitized())) as RequestHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-params
  ((error, req, res, next) =>
    res.status(400).json({ error })) as ErrorRequestHandler
);

router.post(
  '/login',
  passport.authenticate(['login-local'], {
    session: false,
    failWithError: true,
  }),
  ((req, res) => res.json((req.user as any).sanitized())) as RequestHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-params
  ((error, req, res, next) =>
    res.status(400).json({ error })) as ErrorRequestHandler
);

router.get('/verify', verify(true), (req, res) =>
  res.json((req.user as any).sanitized())
);
