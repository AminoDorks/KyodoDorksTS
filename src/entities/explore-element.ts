import z from 'zod';

import { CircleSchema } from './circle';

export const ExploreElementSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  type: z.number(),
  circleList: z.array(CircleSchema),
});

export type ExploreElement = z.infer<typeof ExploreElementSchema>;
