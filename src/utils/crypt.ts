import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';

import { SIGNATURE_KEY } from '../constants';
import { TokenPayloadSchema, XSigCredentials } from '../private';

export const generateRandomValue = (): string => { return Math.random().toString(36).substring(2, 15); };

export const generateXSignature = (): string => {
    return sign({ exp: Date.now(), typeof: 'xSig' }, SIGNATURE_KEY, {
        algorithm: 'HS256',
        header: {
            alg: 'HS256',
            typ: 'JWT'
        }
    });
};

export const generateXSig = (credentials: XSigCredentials): string => {
    return createHash('sha256')
        .update(JSON.stringify(credentials))
        .digest('hex');
};

export const tokenHasExpired = (token: string): boolean => {
    try {
        const payload = TokenPayloadSchema.parse(JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8')));
        
        return payload.exp < (Date.now() / 1000);
    } catch { return true; };
};