import z from 'zod';

import { ShortMemberSchema } from './member';

export const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  circleId: z.string(),
  uid: z.string(),
  user: ShortMemberSchema,
  content: z.string(),
  mentionUids: z.array(z.string()),
  type: z.number(),
  status: z.number(),
  refId: z.string(),
  createdTime: z.string(),
  modifiedTime: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
