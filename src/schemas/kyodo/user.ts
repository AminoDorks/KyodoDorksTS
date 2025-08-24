import { z } from 'zod';

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
    bio: z.string(),
    followerCount: z.number(),
    followingCount: z.number(),
    commentCount: z.number(),
    createdTime: z.string(),
});

export type User = z.infer<typeof UserSchema>;