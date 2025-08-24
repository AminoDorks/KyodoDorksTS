import { z } from 'zod';

export const ShareLinkSchema = z.object({
    id: z.string(),
    circleId: z.string(),
    objectId: z.string(),
    objectType: z.number(),
    shareLink: z.string(),
    apiPath: z.string(),
    appPath: z.string(),
    isVanity: z.boolean(),
    createdTime: z.string(),
    updatedTime: z.string()
});

export type ShareLink = z.infer<typeof ShareLinkSchema>;