export interface IValidateReturn {
  isOk: boolean;
  message: string;
}

export const validateUsername = (username: string): IValidateReturn => {
  if (username === undefined) {
    return { isOk: false, message: 'Username is not given' };
  }

  if (username.length < 2) {
    return {
      isOk: false,
      message: 'Username needs to be at least 2 characters long',
    };
  }

  if (username.length > 50) {
    return {
      isOk: false,
      message: 'Username cannot be longer than 50 characters',
    };
  }

  if (!/^([A-Za-z0-9]|_|-)([A-Za-z0-9]|_|-)*$/.test(username)) {
    return { isOk: false, message: 'Username is not in valid format' };
  }

  return { isOk: true, message: '' };
};

export const validatePassword = (password: string): IValidateReturn => {
  if (password === undefined) {
    return { isOk: false, message: 'Password is not given' };
  }

  if (password.length < 12) {
    return {
      isOk: false,
      message: 'Password needs to be at least 12 characters long',
    };
  }

  if (password.length > 200) {
    return {
      isOk: false,
      message: 'Password cannot be longer than 200 characters',
    };
  }

  return { isOk: true, message: '' };
};

export const validateDisplayName = (displayName: string): IValidateReturn => {
  if (displayName === undefined) {
    return { isOk: false, message: 'Display name is not given' };
  }

  if (displayName.length < 2) {
    return {
      isOk: false,
      message: 'Display name needs to be at least 2 characters long',
    };
  }

  if (displayName.length > 50) {
    return {
      isOk: false,
      message: 'Display name cannot be longer than 50 characters',
    };
  }

  if (!/^[A-Za-z](\x20?[A-Za-z])*$/.test(displayName)) {
    return { isOk: false, message: 'Display name is not in valid format' };
  }

  return { isOk: true, message: '' };
};

export const validateEmail = (email: string): IValidateReturn => {
  if (email === undefined) {
    return { isOk: false, message: 'Email is not given' };
  }

  if (email.length < 2) {
    return {
      isOk: false,
      message: 'Email needs to be at least 2 characters long',
    };
  }

  if (email.length > 100) {
    return {
      isOk: false,
      message: 'Email cannot be longer than 100 characters',
    };
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return { isOk: false, message: 'Email is not in valid format' };
  }

  return { isOk: true, message: '' };
};
