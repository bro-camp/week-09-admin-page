import { RequestHandler } from 'express';
import { viewsDirPath } from '#global/paths';

export const rootGet: RequestHandler = (req, res) => {
  const authStatus = req.session.isAuth ? 'authorized' : 'unauthorized';

  res.render(`${viewsDirPath}/pages/animated-home`, {
    authStatus,
    username: req.session.username,
    displayName: req.session.displayName,
    email: req.session.email,
  });
};
