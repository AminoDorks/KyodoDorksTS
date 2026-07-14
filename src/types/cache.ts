import type { Account } from '../entities/account';

export type CachedUnit = {
  token: string;
  deviceId: string;
  account: Account;
};
