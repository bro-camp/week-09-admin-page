import { RequestHandler } from 'express';

export const rootPost: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/admin/auth/login');
  });
};
