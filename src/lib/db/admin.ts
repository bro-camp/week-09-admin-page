import bcrypt from 'bcrypt';
import { Admin } from '#models/admin-model';
import { TAdmin, TAdminPartial } from '#types/admin-types';
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
} from '#lib/db/validation';
import { validateAdminInfo } from '#lib/db/admin-validation';

export const addUser = (info: TAdmin) => {
  return new Promise<void>((resolve, reject) => {
    const username = info?.username;
    const displayName = info?.displayName;
    const email = info?.email;
    const password = info?.password;

    const userInfoValidation = validateAdminInfo({
      username,
      displayName,
      email,
      password,
    });

    if (!userInfoValidation.isOk) {
      reject(userInfoValidation.message);
      return;
    }

    const SALT_ROUNDS = 12;

    bcrypt.hash(password, SALT_ROUNDS).then((hashedPassword) => {
      const newUser = new Admin({
        username,
        displayName,
        email,
        password: hashedPassword,
      });
      newUser
        .save()
        .then(() => resolve())
        .catch((err) => reject(`${err}`));
    });
  });
};

export const getUser = (username: string) => {
  return new Promise<TAdmin | null>((resolve, _reject) => {
    if (username.length === 0) {
      resolve(null);
      return;
    }

    Admin.findOne({ username }).then((userObj) => {
      if (userObj === null) {
        resolve(null);
        return;
      }

      const user: TAdmin = {
        username: userObj?.username,
        displayName: userObj?.displayName,
        email: userObj?.email,
        password: userObj?.password,
      };

      resolve(user);
    });
  });
};

export const checkUser = (
  username: string,
  callback: (hasUser: boolean) => void,
) => {
  if (username.length === 0) {
    callback(false);
    return;
  }

  Admin.findOne({ username }).then((userObj) => {
    if (userObj === null) {
      callback(false);
      return;
    }

    callback(true);
  });
};

export const deleteUser = (username: string) => {
  return new Promise<void>((resolve, reject) => {
    if (username.length === 0) {
      reject('Username is not provided');
      return;
    }

    Admin.findOne({ username })
      .then((user) => {
        if (!user) {
          reject(`Username '${username}' does not exist`);
          return null;
        }

        return user.deleteOne();
      })
      .then(() => resolve())
      .catch((err) => {
        console.log(err);
        reject('Server error');
      });
  });
};

export const updateUser = (usernameKey: string, info: TAdminPartial) => {
  return new Promise<void>((resolve, reject) => {
    if (usernameKey.length === 0) {
      reject('Username to be updated is not provided');
      return;
    }

    Admin.findOne({ username: usernameKey })
      .then(async (user) => {
        if (!user) {
          reject(`Username '${usernameKey}' does not exist`);
          return null;
        }

        const updateObj: TAdminPartial = {};

        if (info.username !== undefined) {
          const usernameValidation = validateUsername(info.username);
          if (!usernameValidation.isOk) {
            reject(usernameValidation.message);
            return null;
          }
          updateObj.username = info.username;
        }

        if (info.displayName !== undefined) {
          const displayNameValidation = validateDisplayName(info.displayName);
          if (!displayNameValidation.isOk) {
            reject(displayNameValidation.message);
            return null;
          }
          updateObj.displayName = info.displayName;
        }

        if (info.email !== undefined) {
          const emailValidation = validateEmail(info.email);
          if (!emailValidation.isOk) {
            reject(emailValidation.message);
            return null;
          }
          updateObj.email = info.email;
        }

        if (info.password !== undefined) {
          const passwordValidation = validatePassword(info.password);
          if (!passwordValidation.isOk) {
            reject(passwordValidation.message);
            return null;
          }
          const SALT_ROUNDS = 12;
          const hashedPassword = await bcrypt.hash(info.password, SALT_ROUNDS);
          updateObj.password = hashedPassword;
        }

        return user.updateOne(updateObj);
      })
      .then(() => resolve())
      .catch((err) => {
        console.log(err);
        reject('Server error');
      });
  });
};
