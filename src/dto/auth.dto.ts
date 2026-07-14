import z from 'zod';

import { AccountSchema } from '../entities/account';
import { UserSchema } from '../entities/user';

export const AuthenticationResponseSchema = z.object({
  account: AccountSchema,
  userProfile: UserSchema,
  token: z.string(),
});

export type AuthenticationResponse = z.infer<typeof AuthenticationResponseSchema>;
