import { z } from 'zod';

export const PalletSchema = z.object({
    dominant: z.string(),
    pallet: z.array(z.string()),
    fgColor: z.string()
});

export type Pallet = z.infer<typeof PalletSchema>;