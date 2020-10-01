import passport from 'passport';
import router from './auth.router';
import * as local from './strategies/local';
import verify from './verify';

passport.use('register-local', local.register);
passport.use('login-local', local.login);
passport.use('jwt', local.jwt);

export { router, verify };
