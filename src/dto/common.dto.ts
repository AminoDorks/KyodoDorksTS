import z from 'zod';

export const CommonResponseSchema = z.object({
  code: z.number(),
  apiCode: z.number(),
  message: z.string(),
});

export const UploadResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  media: z.object({
    id: z.string(),
    url: z.string(),
    variants: z.record(z.any(), z.any()),
  }),
});

export type CommonResponse = z.infer<typeof CommonResponseSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
