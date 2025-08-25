import { z } from 'zod';

export const MemberSchema = z.object({
    id: z.string(),
    role: z.number(),
    gRole: z.number(),
    avatar: z.string(),
    handle: z.string(),
    status: z.number(),
    botType: z.number(),
    gStatus: z.number(),
    circleId: z.string(),
    nickname: z.string(),
    premiumType: z.number()
});

export type Member = z.infer<typeof MemberSchema>;