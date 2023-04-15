import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import IUser from '#types/user-type';
import { viewsDirPath } from '#global/paths';
import { addUser, checkUser, getUser } from '#lib/db/admin';

export const loginGet: RequestHandler = (_req, res) => {
  res.render(`${viewsDirPath}/pages/admin/admin-login`);
};

export const loginPost: RequestHandler = (req, res) => {
  const info: {
    username: string;
    password: string;
  } = {
    username: req.body?.username,
    password: req.body?.password,
  };

  getUser(info.username).then((user: IUser | null) => {
    if (!user) {
      const errorMessage = 'Incorrect username';
      res.render(`${viewsDirPath}/pages/admin/admin-login`, {
        errorMessage,
      });
      return;
    }

    bcrypt.compare(info.password, user.password).then((isMatch) => {
      if (!isMatch) {
        const errorMessage = 'Incorrect password';
        res.render(`${viewsDirPath}/pages/admin/admin-login`, {
          errorMessage,
        });
        return;
      }

      req.session.isAuthAdmin = true;
      req.session.admin = {
        username: user.username,
        displayName: user.displayName,
        email: user.email,
      };
      res.redirect('/admin/panel');
    });
  });
};

export const signupGet: RequestHandler = (_req, res) => {
  res.render(`${viewsDirPath}/pages/admin/admin-signup`);
};

export const signupPost: RequestHandler = async (req, res) => {
  const info = {
    username: req.body?.username,
    displayName: req.body?.displayName,
    email: req.body?.email,
    password: req.body?.password,
  };

  checkUser(info.username, (hasUser) => {
    if (hasUser) {
      const errorMessage = `User with username '${info.username}' already exists`;
      res.render(`${viewsDirPath}/pages/admin/admin-signup`, {
        errorMessage,
      });
      return;
    }

    addUser(info)
      .then(() => res.render(`${viewsDirPath}/pages/admin/admin-signup-success`))
      .catch((errorMessage) => res.render(`${viewsDirPath}/pages/admin/admin-signup`, {
        errorMessage,
      }));
  });
};
