import { z } from 'zod';

export const PalletSchema = z.object({
    dominant: z.string().optional(),
    pallet: z.array(z.string()).optional(),
    fgColor: z.string().optional()
});

export type Pallet = z.infer<typeof PalletSchema>;