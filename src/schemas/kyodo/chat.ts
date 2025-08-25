import { z } from 'zod';

import { PalletSchema } from './pallet';
import { MemberSchema } from './member';
import { MessageSchema } from './message';

export const ChatSchema = z.object({
    id: z.string(),
    circleId: z.string(),
    condition: z.number(),
    icon: z.string(),
    theme: z.union([PalletSchema, z.object()]),
    name: z.string(),
    type: z.number(),
    status: z.number(),
    activityType: z.number(),
    activityPrivacy: z.number(),
    specialBadge: z.number(),
    memberSummary: z.array(MemberSchema),
    memberCount: z.number(),
    memberLimit: z.number(),
    readOnly: z.boolean(),
    lastMessage: MessageSchema.optional()
});

export type Chat = z.infer<typeof ChatSchema>;