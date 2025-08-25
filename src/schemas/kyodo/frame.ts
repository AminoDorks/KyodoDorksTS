import { z } from 'zod';
import { PalletSchema } from './pallet';

export const FrameSchema = z.object({
    id: z.string(),
    resource: z.string(),
    icon: z.string(),
    name: z.string(),
    theme: PalletSchema,
    version: z.number(),
    status: z.number(),
    isExclusive: z.boolean(),
    isFree: z.boolean()
});

export type Frame = z.infer<typeof FrameSchema>;