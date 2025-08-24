import { z } from 'zod';
import { BasicResponseSchema } from './basic';
import { UserSchema } from '../kyodo/user';
import { PalletSchema } from '../kyodo/pallet';
import { ShareLinkSchema } from '../kyodo/shareLink';

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

export const ExtractLinkResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    shareLink: ShareLinkSchema
});

export type AuthorizeResponse = z.infer<typeof AuthorizeResponseSchema>;
export type UploadMediaResponse = z.infer<typeof UploadMediaResponseSchema>;
export type ExtractLinkResponse = z.infer<typeof ExtractLinkResponseSchema>;