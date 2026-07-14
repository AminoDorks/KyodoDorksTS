import z from 'zod';

export const LinkResolutionSchema = z.object({
  id: z.string(),
  circleId: z.string(),
  objectId: z.string(),
  objectType: z.number(),
});

export type LinkResolution = z.infer<typeof LinkResolutionSchema>;
