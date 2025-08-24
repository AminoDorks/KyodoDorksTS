import { z } from 'zod';
import { BasicResponseSchema } from './basic';
import { UserSchema } from '../kyodo/user';

export const AuthorizeResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    apiToken: z.string(),
    apiUser: UserSchema
});

export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;