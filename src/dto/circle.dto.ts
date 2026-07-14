import z from 'zod';

import { CommonResponseSchema } from './common.dto';
import { CircleSchema } from '../entities/circle';
import { ExploreElementSchema } from '../entities/explore-element';

export const GetCircleResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  circle: CircleSchema,
});

export const ManyCirclesResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  circleList: z.array(CircleSchema),
});

export const ExploreResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  exploreModuleList: z.array(ExploreElementSchema),
});

export type GetCircleResponse = z.infer<typeof GetCircleResponseSchema>;
export type ManyCirclesResponse = z.infer<typeof ManyCirclesResponseSchema>;
export type ExploreResponse = z.infer<typeof ExploreResponseSchema>;
