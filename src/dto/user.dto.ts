import z from 'zod';

import { CommonResponseSchema } from './common.dto';
import { UserSchema } from '../entities/user';

export const GetUserResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  userProfile: UserSchema,
});

export const ManyUsersResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  userProfileList: z.array(UserSchema),
  pagination: z.any(),
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type ManyUsersResponse = z.infer<typeof ManyUsersResponseSchema>;
