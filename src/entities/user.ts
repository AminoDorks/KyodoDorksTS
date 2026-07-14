import z from 'zod';

export const UserSchema = z.object({
  uid: z.string(),
  circleId: z.string(),
  avatar: z.string().nullable(),
  avatarFrameId: z.string().nullable(),
  cover: z.string().optional(),
  nickname: z.string(),
  username: z.string().optional(),
  status: z.number(),
  isHidden: z.boolean(),
  isJoined: z.boolean(),
  role: z.number(),
  followerCount: z.number(),
  followingCount: z.number(),
  isOnline: z.boolean(),
  premiumType: z.number(),
  createdTime: z.string(),
  modifiedTime: z.string(),
});

export type User = z.infer<typeof UserSchema>;
