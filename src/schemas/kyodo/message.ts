import { z } from 'zod';
import { MemberSchema } from './member';

export const MessageSchema = z.object({
    id: z.string(),
    uid: z.string(),
    content: z.string(),
    author: MemberSchema,
    type: z.number(),
    status: z.number(),
    bubble: z.object({
        type: z.number(),
        bgColor: z.string(),
        textColor: z.string(),
        linkColor: z.string()
    }).optional()
});

export type Message = z.infer<typeof MessageSchema>;