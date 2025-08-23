import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';

import { SIGNATURE_KEY } from '../constants';
import { XSigCredentials } from '../private';

export const generateHalfDeviceId = (): string => { return Math.random().toString(36).substring(2, 15); };

export const generateXSignature = (): string => {
    return sign({ exp: new Date(Date.now() + 10000), typeof: 'xSig' }, SIGNATURE_KEY, {
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