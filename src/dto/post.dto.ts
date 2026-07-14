import z from 'zod';

import { CommonResponseSchema } from './common.dto';
import { PostSchema } from '../entities/post';

export const GetPostResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  post: PostSchema,
});

export const ManyPostsResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  postList: z.array(PostSchema),
});

export type ManyPostsResponse = z.infer<typeof ManyPostsResponseSchema>;
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;
