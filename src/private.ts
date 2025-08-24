import { z } from 'zod';

export const XSigCredentialsSchema = z.object({
    startTime: z.string(),
    uid: z.string(),
    deviceId: z.string(),
    data: z.union([z.string(), z.instanceof(Buffer)])
});

export const TokenPayloadSchema = z.object({
    auth_token: z.string(),
    iat: z.number(),
    exp: z.number()
});

export type Safe<T> = NonNullable<Required<Readonly<T>>>;
export type Defined<T> = NonNullable<Required<T>>;
export type MayUndefined<T> = T | undefined;
export type HeadersType = Record<string, string>;

export type XSigCredentials = z.infer<typeof XSigCredentialsSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema>;