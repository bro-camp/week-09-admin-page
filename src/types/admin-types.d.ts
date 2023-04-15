import type { Partial } from '#types/mapper-types';

export type TAdmin = {
  username: string;
  password: string;
  email: string;
  displayName: string;
};

export type TAdminPartial = Partial<TAdmin>;
