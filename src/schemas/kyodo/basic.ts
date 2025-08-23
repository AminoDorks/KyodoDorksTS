import { z } from 'zod';

export const BasicResponseSchema = z.object({
    code: z.number(),
    apiCode: z.number(),
    message: z.string(),
    duration: z.number()
});

export type BasicResponse = z.infer<typeof BasicResponseSchema>;