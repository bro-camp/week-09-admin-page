import { RequestHandler } from 'express';

const redirectIfNotAuthUser: RequestHandler = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect('/user/auth/login-signup');
  }
};

const redirectIfAuthUser: RequestHandler = (req, res, next) => {
  if (req.session.isAuth) {
    res.redirect('/home');
  } else {
    next();
  }
};

export {
  redirectIfNotAuthUser,
  redirectIfAuthUser,
};
