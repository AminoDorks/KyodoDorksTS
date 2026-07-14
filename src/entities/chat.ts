import z from 'zod';

import { ShortMemberSchema } from './member';

export const ChatSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  icon: z.string().optional(),
  name: z.string().optional(),
  type: z.number(),
  status: z.number(),
  memberCount: z.number(),
  memberSummary: z.array(ShortMemberSchema),
  lastActiveTime: z.string(),
  background: z.string().nullable().optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
  coHostUids: z.array(z.string()),
  isReadOnly: z.boolean(),
  content: z.string().nullable().optional(),
});

export type Chat = z.infer<typeof ChatSchema>;
