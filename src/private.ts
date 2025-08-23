import { z } from 'zod';

export const XSigCredentialsSchema = z.object({
    startTime: z.string(),
    uid: z.string(),
    deviceId: z.string(),
    data: z.string()
});

export type Safe<T> = NonNullable<Required<Readonly<T>>>;
export type Defined<T> = NonNullable<Required<T>>;
export type MayUndefined<T> = T | undefined;
export type HeadersType = Record<string, string>;

export type XSigCredentials = z.infer<typeof XSigCredentialsSchema>;