import { z } from 'zod';
import { BasicResponseSchema } from './basic';
import { UserSchema } from '../kyodo/user';

export const GetUserResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    user: UserSchema,
    circle: z.nullable(z.object())
});

export const GetUsersResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    users: z.array(UserSchema)
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;