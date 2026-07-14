import z from 'zod';

export const ShortMemberSchema = z.object({
  uid: z.string(),
  avatar: z.string().optional(),
  nickname: z.string(),
  isNicknameVerified: z.boolean(),
  status: z.number(),
  role: z.number(),
});

export const MemberSchema = z.object({
  chatId: z.string(),
  circleId: z.string(),
  uid: z.string(),
  kickerUid: z.string().nullable(),
  user: z.object({
    ...ShortMemberSchema.shape,
    isHidden: z.boolean(),
    isJoined: z.boolean(),
    isOnline: z.boolean(),
  }),
});

export type ShortMember = z.infer<typeof ShortMemberSchema>;
export type Member = z.infer<typeof MemberSchema>;
