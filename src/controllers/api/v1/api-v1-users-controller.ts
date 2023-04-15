import { RequestHandler } from 'express';
import User from '#models/user-model';
import {
  addUser, checkUser, deleteUser, updateUser,
} from '#lib/db/user';
import { TUserPartial } from '#types/user-partial-type';
import { escapeRegex } from '#lib/oth/escape-regex';

export const usersGet: RequestHandler = async (_req, res) => {
  try {
    const usersRaw = await User.find({});
    const users = await usersRaw.map(
      ({
        _id, username, displayName, email,
      }) => ({
        id: _id,
        username,
        displayName,
        email,
      }),
    );
    res.send({ users });
  } catch (err) {
    console.log(err);
  }
};

export const usersSearchGet: RequestHandler = async (req, res) => {
  const query = decodeURIComponent(req.query?.query?.toString() ?? '');
  const regexEscapedQuery = escapeRegex(query);
  const searchRegex = new RegExp(`${regexEscapedQuery}`, 'i');
  const users = await User.find({
    $or: [
      { username: { $regex: searchRegex } },
      { displayName: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ],
  });
  res.send({ users });
};

export const usersOnePost: RequestHandler = async (req, res) => {
  const info = {
    username: req.body?.username,
    displayName: req.body?.displayName,
    email: req.body?.email,
    password: req.body?.password,
  };

  checkUser(info.username, (hasUser) => {
    if (hasUser) {
      const errorMessage = `User with username '${info.username}' already exists`;
      res.send({ isSuccess: true, message: errorMessage });
      return;
    }

    addUser(info)
      .then(() => {
        const successMessage = 'User has been successfully added';
        res.send({ isSuccess: true, message: successMessage });
      })
      .catch((errorMessage) => res.send({
        isSuccess: true,
        message: errorMessage,
      }));
  });
};

export const usersOneDelete: RequestHandler = async (req, res) => {
  const username = req.body?.username;
  if (!username) {
    res.send({ isSuccess: false, message: 'Username is not provided' });
    return;
  }

  deleteUser(username)
    .then(() => res.send({
      isSuccess: true,
      message: `User '${username}' has been successfully removed`,
    }))
    .catch((err) => res.send({ isSuccess: false, message: err }));
};

export const usersOnePatch: RequestHandler = async (req, res) => {
  const usernameKey: string | undefined = req.body?.usernameKey;

  const info: TUserPartial = {
    username: req.body?.info?.username,
    displayName: req.body?.info?.displayName,
    email: req.body?.info?.email,
    password: req.body?.info?.password,
  };

  console.log(info.password);

  if (!usernameKey) {
    res.send({
      isSuccess: false,
      message: 'Username to be updated is not provided',
    });
    return;
  }

  updateUser(usernameKey, info)
    .then(() => res.send({
      isSuccess: true,
      message: `User '${usernameKey}' has been successfully updated.`,
      info,
    }))
    .catch((err) => res.send({ isSuccess: false, message: err, info }));
};
