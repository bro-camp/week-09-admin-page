import { RequestHandler } from 'express';

export const rootGet: RequestHandler = (_req, res) => {
  res.redirect('/');
};
