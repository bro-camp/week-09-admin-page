declare module 'express-session' {
  interface SessionData {
    isAuthAdmin?: boolean;
    admin?: {
      username: string;
      displayName: string;
      email: string;
    };
    isAuth?: boolean;
    username?: string;
    displayName?: string;
    email?: string;
  }
}

export {};
