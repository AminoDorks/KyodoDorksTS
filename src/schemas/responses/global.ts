import { z } from 'zod';
import { BasicResponseSchema } from './basic';
import { UserSchema } from '../kyodo/user';
import { PalletSchema } from '../kyodo/pallet';

export const AuthorizeResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    apiToken: z.string(),
    apiUser: UserSchema
});

export const UploadMediaResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    mediaValue: z.string(),
    pallet: PalletSchema
});

export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;
export type UploadMediaResponse = z.infer<typeof UploadMediaResponseSchema>;