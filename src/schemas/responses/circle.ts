import { z } from 'zod';

import { BasicResponseSchema } from './basic';
import { BannerMetaCircleSchema, CircleSchema, ExploredCircleSchema } from '../kyodo/circle';

export const GetCircleResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    circle: CircleSchema
});

export const GetExploreResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    modules: z.array(z.object({
        id: z.string(),
        type: z.number(),
        queryType: z.number(),
        title: z.string(),
        itemList: z.array(ExploredCircleSchema),
        counter: z.number()
    })),
    bannerMeta: z.object({
        image: z.string(),
        circle: BannerMetaCircleSchema
    })
});

export type GetCircleResponse = z.infer<typeof GetCircleResponseSchema>;
export type GetExploreResponse = z.infer<typeof GetExploreResponseSchema>;