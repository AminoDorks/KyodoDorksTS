import { HttpWorkflow } from '../core/httpworkflow';
import { DorksManagerImpl } from '../interfaces/manager';
import { Safe } from '../private';
import { CachedAccount, KyodoDorksConfig } from '../public';
import { BasicAppResponse, BasicAppResponseSchema, BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { AuthorizeResponse, AuthorizeResponseSchema } from '../schemas/responses/global';
import cache from '../utils/cache';
import { tokenHasExpired } from '../utils/crypt';
import { KyodoDorksAPIError } from '../utils/exceptions';
import { LOGGER } from '../utils/logger';

export class DorksSecurityManager implements DorksManagerImpl {
    endpoint = '/v1/g/s';
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    private __account?: CachedAccount;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow) {
        this.config = config;
        this.httpWorkflow = httpWorkflow;
    };

    get account (): CachedAccount {
        if (!this.__account) {
            LOGGER.error('Account is not authorized');
            KyodoDorksAPIError.throw(401);
        };

        return this.__account;
    };

    public authorize = async (email: Safe<string>, password: Safe<string>, deviceId?: string): Promise<void> => {
        const cachedAccount = cache.getFromCache(`${email}-${password}`);

        if (cachedAccount && !tokenHasExpired(cachedAccount.apiToken)) {
            LOGGER.child({ nickname: cachedAccount.user.nickname }).info('Logged from cache');
            this.httpWorkflow.headers = {
                'authorization': cachedAccount.apiToken,
                'device-id': cachedAccount.deviceId,
                'uid': cachedAccount.user.id
            };
            this.__account = cachedAccount;

            return;
        } else if (cachedAccount && tokenHasExpired(cachedAccount.apiToken)) this.httpWorkflow.headers = { 'device-id': cachedAccount.deviceId };

        if (deviceId) this.httpWorkflow.headers = { 'device-id': deviceId };

        const authorizeResponse = await this.httpWorkflow.sendPost<AuthorizeResponse>({
            path: `${this.endpoint}/auth/login`,
            body: JSON.stringify({
                type: 0,
                email,
                password
            })
        }, AuthorizeResponseSchema);

        this.httpWorkflow.headers = { 'authorization': authorizeResponse.apiToken, 'uid': authorizeResponse.apiUser.id };

        this.__account = cache.addToCache(`${email}-${password}`, {
            apiToken: authorizeResponse.apiToken,
            deviceId: this.httpWorkflow.header('device-id'),
            email: email,
            user: authorizeResponse.apiUser
        });
    };

    public sendVerification = async (): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/auth/resend-verification-email`,
            body: JSON.stringify({})
        }, BasicResponseSchema);
    };

    public changeEmail = async (newEmail: Safe<string>, password: Safe<string>): Promise<BasicResponse> => {
        const response = await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/accounts/change-email`,
            body: JSON.stringify({
                email: newEmail,
                password
            })
        }, BasicResponseSchema);

        this.httpWorkflow.deleteHeader('authorization');
        cache.removeFromCache(`${this.account.email}-${password}`);
        await this.authorize(newEmail, password);

        return response;
    };

    public changePassword = async (currentPassword: Safe<string>, newPassword: Safe<string>): Promise<BasicResponse> => {
        const response = await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/accounts/change-password`,
            body: JSON.stringify({
                current: currentPassword,
                new: newPassword
            })
        }, BasicResponseSchema);

        this.httpWorkflow.deleteHeader('authorization');
        cache.removeFromCache(`${this.account.email}-${currentPassword}`);
        await this.authorize(this.account.email, newPassword);

        return response;
    };

    public verifyEmail = async (accountId: Safe<string>, token: Safe<string>): Promise<BasicAppResponse> => {
        return await this.httpWorkflow.sendServicedPost<BasicAppResponse>({
            path: `/account/verify-email`,
            body: JSON.stringify({
                accountId,
                token
            })
        }, BasicAppResponseSchema);
    };
};