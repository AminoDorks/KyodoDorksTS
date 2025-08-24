import { z } from 'zod';

export const BasicResponseSchema = z.object({
    code: z.number(),
    apiCode: z.number(),
    message: z.string(),
    duration: z.number()
});

export const BasicAppResponseSchema = z.object({
    message: z.string()
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;
export type BasicAppResponse = z.infer<typeof BasicAppResponseSchema>;