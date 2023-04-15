import { RequestHandler } from 'express';
import { viewsDirPath } from '#global/paths';
import User from '#models/user-model';

export const rootGet: RequestHandler = async (_req, res) => {
  const usersRaw = await User.find({});
  let counter = 0;
  const users = await usersRaw.map(({ username, displayName, email }) => ({
    userNo: ++counter, // eslint-disable-line no-plusplus
    username,
    displayName,
    email,
  }));

  res.render(`${viewsDirPath}/pages/admin/admin-panel`, { users });
};
