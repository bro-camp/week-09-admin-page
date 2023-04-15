import { TAdmin } from '#types/admin-types';
import {
  validateDisplayName,
  validateEmail,
  validatePassword,
  validateUsername,
  IValidateReturn,
} from '#lib/db/validation';

export const validateAdminInfo = (userInfo: TAdmin): IValidateReturn => {
  const usernameValidation = validateUsername(userInfo.username);
  const passwordValidation = validatePassword(userInfo.password);
  const displayNameValidation = validateDisplayName(userInfo.displayName);
  const emailValidation = validateEmail(userInfo.email);

  if (!usernameValidation.isOk) {
    return { isOk: false, message: usernameValidation.message };
  }

  if (!passwordValidation.isOk) {
    return { isOk: false, message: passwordValidation.message };
  }

  if (!displayNameValidation.isOk) {
    return { isOk: false, message: displayNameValidation.message };
  }

  if (!emailValidation.isOk) {
    return { isOk: false, message: emailValidation.message };
  }

  return { isOk: true, message: '' };
};
