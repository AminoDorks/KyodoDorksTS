import { z } from 'zod';
import { UserSchema } from './user';

export const PostSchema = z.object({
    id: z.string(),
    circleId: z.string(),
    uid: z.string(),
    title: z.string(),
    content: z.string(),
    mediaMap: z.record(z.string(), z.object({
        type: z.number(),
        src: z.string(),
        isCover: z.boolean()
    })),
    type: z.number(),
    isPinned: z.boolean(),
    isHighlighted: z.boolean(),
    likeCount: z.number(),
    replyCount: z.number(),
    status: z.number(),
    liked: z.boolean().optional(),
    user: UserSchema
});

export type Post = z.infer<typeof PostSchema>;