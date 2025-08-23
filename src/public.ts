import { z } from 'zod';
import { HttpWorkflow } from './core/httpworkflow';

export const ScopeUnion = z.union([z.literal('global'), z.literal('circle')]);

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
    httpWorkflow: z.instanceof(HttpWorkflow).optional()
});

export type KyodoDorksConfig = z.infer<typeof KyodoDorksConfigSchema>;