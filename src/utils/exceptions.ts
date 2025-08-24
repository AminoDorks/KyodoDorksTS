export interface ApiErrorData {
  message: string;
  name?: string;
}

export class KyodoDorksAPIError extends Error {
    public readonly code: number;

    constructor(code: number, data: ApiErrorData) {
        super(data.message);
        this.name = data.name || `AminoDorksAPIError.${code}`;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, KyodoDorksAPIError);
        }
    }

    static get(code: number): KyodoDorksAPIError | null {
        const data = KyodoDorksAPIError.errors[code];

        return data ? new KyodoDorksAPIError(code, data) : null;
    }

    static throw(code: number): never {
        const error = this.get(code);
        if (error) throw error;

        throw new KyodoDorksAPIError(code, { message: `Unknown error code: ${code}.` });
    }

    static readonly errors: Record<number, ApiErrorData> = {
        401: {
            message: 'Invalid credentials',
            name: 'KyodoDorksAPIError.InvalidCredentials'
        },
        403: {
            message: 'Forbidden. Cloudflare verification failed',
            name: 'KyodoDorksAPIError.Forbidden'
        },
        453: {
            message: 'Invalid Request, please update to the latest version',
            name: 'KyodoDorksAPIError.InvalidRequest'
        },
        498: {
            message: 'Session Expired',
            name: 'KyodoDorksAPIError.SessionExpired'
        },
        500: {
            message: 'Email is already verified',
            name: 'KyodoDorksAPIError.EmailAlreadyVerified'
        }
    };
};