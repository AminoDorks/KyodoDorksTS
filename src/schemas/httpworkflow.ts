import { z } from 'zod';

export const PostRequestConfigSchema = z.object({
    path: z.string().readonly(),
    body: z.string().readonly(),
    contentType: z.string().optional(),
});

export const GetRequestConfigSchema = PostRequestConfigSchema.omit({ body: true });
export const UrlEncodedRequestConfigSchema = GetRequestConfigSchema.required();
export const DeleteRequestConfigSchema = GetRequestConfigSchema.omit({ contentType: true });

export const RawRequestConfigSchema = z.object({
    ...PostRequestConfigSchema.shape,
    method: z.string(),
    headers: z.record(z.string(), z.string())
}).optional();

export const BufferRequestConfigSchema = z.object({
    ...UrlEncodedRequestConfigSchema.shape,
    body: z.instanceof(Buffer)
});

export type PostRequestConfig = z.infer<typeof PostRequestConfigSchema>;
export type GetRequestConfig = z.infer<typeof GetRequestConfigSchema>;
export type DeleteRequestConfig = z.infer<typeof DeleteRequestConfigSchema>
export type UrlEncodedRequestConfig = z.infer<typeof UrlEncodedRequestConfigSchema>;
export type BufferRequestConfig = z.infer<typeof BufferRequestConfigSchema>;