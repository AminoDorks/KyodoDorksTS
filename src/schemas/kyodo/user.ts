import { z } from 'zod';

import { FrameSchema } from './frame';

export const UserSchema = z.object({
    id: z.string(),
    intId: z.number(),
    circleId: z.string(),
    banner: z.nullable(z.string()),
    bannerTheme: z.object({
        dominant: z.string(),
        fgColor: z.string()
    }),
    avatar: z.nullable(z.string()),
    nickname: z.string(),
    handle: z.string(),
    gRole: z.number(),
    role: z.number(),
    botType: z.number(),
    premiumType: z.number(),
    privacyChat: z.number(),
    privacyWall: z.number(),
    gStatus: z.number(),
    status: z.number(),
    badgeFlags: z.number(),
    isVerified: z.boolean(),
    joined: z.boolean(),
    adminInfo: z.object({
        trustLevel: z.string()
    }),
    isOnline: z.boolean(),
    lastOnline: z.string(),
    avatarFrame: z.optional(FrameSchema),
    bio: z.string().optional(),
    followerCount: z.number().optional(),
    followingCount: z.number().optional(),
    commentCount: z.number().optional()
});

export type User = z.infer<typeof UserSchema>;