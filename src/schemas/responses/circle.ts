import { z } from 'zod';

import { BasicResponseSchema } from './basic';
import { BannerMetaCircleSchema, CircleSchema, ExploredCircleSchema } from '../kyodo/circle';
import { PostSchema } from '../kyodo/post';

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

export const GetPostResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    post: PostSchema
});

export const GetPostsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    posts: z.array(PostSchema)
});

export type GetCircleResponse = z.infer<typeof GetCircleResponseSchema>;
export type GetExploreResponse = z.infer<typeof GetExploreResponseSchema>;
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;
export type GetPostsResponse = z.infer<typeof GetPostsResponseSchema>;