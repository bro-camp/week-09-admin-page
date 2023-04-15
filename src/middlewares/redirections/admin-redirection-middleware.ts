import { RequestHandler } from 'express';

const redirectIfNotAuthAdmin: RequestHandler = (req, res, next) => {
  if (req.session.isAuthAdmin) {
    next();
  } else {
    res.redirect('/admin/auth/login');
  }
};

const redirectIfAuthAdmin: RequestHandler = (req, res, next) => {
  if (req.session.isAuthAdmin) {
    res.redirect('/admin/panel');
  } else {
    next();
  }
};

const redirectFromAdminSignupIfNotDevelopment: RequestHandler = (
  req,
  res,
  next,
) => {
  if (req.app.get('env') === 'development') {
    next();
  } else {
    res.redirect('/admin/auth/login');
  }
};

export {
  redirectIfNotAuthAdmin,
  redirectIfAuthAdmin,
  redirectFromAdminSignupIfNotDevelopment,
};
