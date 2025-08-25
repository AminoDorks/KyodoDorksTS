import { z } from 'zod';

export const TopicSchema = z.object({
    id: z.string(),
    name: z.string(),
    lowercase: z.string(),
    score: z.number(),
    official: z.boolean(),
    fgColor: z.string(),
    bgColor: z.string(),
    createdTime: z.string(),
    modifiedTime: z.string()
});

export type Topic = z.infer<typeof TopicSchema>;