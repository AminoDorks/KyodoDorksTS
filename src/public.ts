import { z } from 'zod';
import { HttpWorkflow } from './core/httpworkflow';
import { UserSchema } from './schemas/kyodo/user';

export const ScopeUnion = z.union([z.literal('global'), z.literal('circle')]);
export const UsersFilterUnion = z.union([z.literal('all'), z.literal('online')]);

export const KyodoDorksConfigSchema = z.object({
    enviroment: z.object({
        scope: ScopeUnion,
        circleId: z.string().optional()
    }),
    credentials: z.object({
        deviceId: z.string(),
        apiToken: z.string()
    }).optional(),

    enableLogging: z.boolean().default(false).optional(),
    httpWorkflowInstance: z.instanceof(HttpWorkflow).optional()
});

export const CachedAccountSchema = z.object({
    apiToken: z.string(),
    deviceId: z.string(),
    email: z.string(),
    user: UserSchema
});

export const StartLimitSchema = z.object({
    start: z.number(),
    limit: z.number()
});

export type KyodoDorksConfig = z.infer<typeof KyodoDorksConfigSchema>;
export type CachedAccount = z.infer<typeof CachedAccountSchema>;
export type StartLimit = z.infer<typeof StartLimitSchema>;
export type UsersFilter = z.infer<typeof UsersFilterUnion>;