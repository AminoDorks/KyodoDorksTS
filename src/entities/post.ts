import z from 'zod';

import { UserSchema } from './user';

export const PostSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  type: z.number(),
  uid: z.string(),
  title: z.string().optional(),
  content: z.string(),
  likeCount: z.number().optional(),
  replyCount: z.number().optional(),
  status: z.number(),
  user: UserSchema,
  createdTime: z.string(),
  modifiedTime: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
