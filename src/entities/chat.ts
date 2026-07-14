import z from 'zod';

import { ShortMemberSchema } from './member';

export const ChatSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  icon: z.string(),
  name: z.string(),
  type: z.number(),
  status: z.number(),
  memberCount: z.number(),
  memberSummary: z.array(ShortMemberSchema),
  lastActiveTime: z.string(),
  background: z.string().nullable(),
  createdTime: z.string(),
  modifiedTime: z.string(),
  coHostUids: z.array(z.string()),
  isReadOnly: z.boolean(),
  content: z.string().nullable(),
});

export type Chat = z.infer<typeof ChatSchema>;
