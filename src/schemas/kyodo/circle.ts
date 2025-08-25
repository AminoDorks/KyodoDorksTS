import { z } from 'zod';
import { TopicSchema } from './topic';
import { PalletSchema } from './pallet';
import { UserSchema } from './user';

export const CircleSchema = z.object({
    id: z.string(),
    vanity: z.string(),
    icon: z.string(),
    banner: z.string(),
    name: z.string(),
    language: z.string(),
    primaryTopicId: z.string(),
    topic: z.nullable(TopicSchema),
    memberCount: z.number(),
    theme: PalletSchema,
    bannerTheme: PalletSchema,
    pageConfig: z.array(z.object({
        id: z.string(),
        circleId: z.string(),
        pageId: z.string(),
        label: z.string(),
    })).optional(),
    isVerified: z.boolean(),
    isFeatured: z.boolean(),
    securityLevel: z.number(),
    privacy: z.number(),
    isNSFW: z.boolean(),
    status: z.number(),
    dau: z.number(),
    createdTime: z.string(),
    memberPreview: z.array(UserSchema).optional(),
    staffPreview: z.array(UserSchema).optional(),
    owner: UserSchema.optional()
});

export const ExploredCircleSchema = z.object({
    id: z.string().optional(),
    vanity: z.nullable(z.string()).optional(),
    icon: z.string().optional(),
    banner: z.nullable(z.string()).optional(),
    name: z.string().optional(),
    language: z.string().optional(),
    primaryTopicId: z.string().optional(),
    topic: z.nullable(TopicSchema).optional(),
    memberCount: z.number().optional(),
    theme: PalletSchema.optional(),
    isVerified: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    securityLevel: z.number().optional(),
    privacy: z.number().optional(),
    isNSFW: z.boolean().optional(),
    status: z.number().optional(),
    dau: z.number().optional()
});

export const BannerMetaCircleSchema = z.object({
    id: z.string(),
    vanity: z.string(),
    icon: z.string(),
    banner: z.string(),
    name: z.string(),
    language: z.string(),
    status: z.number(),
    dau: z.number(),
    theme: PalletSchema,
    createdTime: z.string(),
})

export type Circle = z.infer<typeof CircleSchema>;
export type BannerMetaCircle = z.infer<typeof BannerMetaCircleSchema>;
export type ExploredCircle = z.infer<typeof ExploredCircleSchema>;