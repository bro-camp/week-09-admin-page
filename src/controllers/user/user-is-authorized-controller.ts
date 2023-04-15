import { RequestHandler } from 'express';

export const rootGet: RequestHandler = (req, res) => {
  res.status(200).json({ isAuthorized: !!req.session.isAuth });
};
