import { z } from 'zod';
import { MessageSchema } from './message';
import { UserSchema } from './user';
import { MemberSchema } from './member';

export const MessageItemSchema = z.object({
    ...MessageSchema.shape,
    author: z.object({
        ...UserSchema.shape,
        ...MemberSchema.shape
    })
});

export type MessageItem = z.infer<typeof MessageItemSchema>;