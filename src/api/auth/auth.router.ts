import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import passport from 'passport';
import { users } from '../../models';
import verify from './verify';

const router = Router();
export default router;

router.post(
  '/register',
  passport.authenticate(['register-local'], {
    session: false,
    failWithError: true,
  }),
  ((req, res) => res.json(users.sanitize(req.user!))) as RequestHandler,
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
  ((req, res) => res.json(users.sanitize(req.user!))) as RequestHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-params
  ((error, req, res, next) =>
    res.status(400).json({ error })) as ErrorRequestHandler
);

router.get(
  '/verify',
  verify(true),
  ((req, res) => res.json(users.sanitize(req.user!))) as RequestHandler,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, max-params
  ((error, req, res, next) =>
    res.status(400).json({ error })) as ErrorRequestHandler
);
