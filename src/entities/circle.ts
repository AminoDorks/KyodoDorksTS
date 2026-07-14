import z from 'zod';

export const CircleSchema = z.object({
  id: z.string(),
  uid: z.string(),
  cover: z.string().nullable(),
  icon: z.string(),
  sidebarCover: z.string().nullable(),
  name: z.string(),
  isVerified: z.boolean(),
  privacy: z.number(),
  vanity: z.string(),
  status: z.number(),
  memberCount: z.number(),
  tagline: z.string(),
  language: z.string(),
  isFeatured: z.boolean(),
  isRestricted: z.boolean(),
  createdTime: z.string(),
  modifiedTime: z.string(),
});

export type Circle = z.infer<typeof CircleSchema>;
