import { DorksSecurityManager } from '../managers/securityManager';
import { Safe } from '../private';
import { CachedAccount, KyodoDorksConfig } from '../public';
import { HttpWorkflow } from './httpworkflow';
import initLogger from '../utils/logger';
import { ExtractLinkResponse, ExtractLinkResponseSchema, UploadMediaResponse, UploadMediaResponseSchema } from '../schemas/responses/global';
import { DorksUserManager } from '../managers/userManager';
import { ShareLink } from '../schemas/kyodo/shareLink';

export class KyodoDorks {
    private readonly __config: KyodoDorksConfig;
    private readonly __httpWorkflow: HttpWorkflow;

    private __securityManager?: DorksSecurityManager;
    private __userManager?: DorksUserManager;

    constructor(config: KyodoDorksConfig = { enviroment: { scope: 'global' } }) {
        this.__config = config;
        this.__httpWorkflow = this.__config.httpWorkflowInstance || new HttpWorkflow();

        if (this.__config.credentials) {
            this.__httpWorkflow.headers = {
                'device-id': this.__config.credentials.deviceId,
                'authorization': this.__config.credentials.apiToken
            };
        };

        initLogger(!!config.enableLogging);
    };

    get config (): KyodoDorksConfig {
        return this.__config;
    };

    get account (): CachedAccount {
        return this.security.account;
    };

    get security (): DorksSecurityManager {
        if (!this.__securityManager) this.__securityManager = new DorksSecurityManager(this.__config, this.__httpWorkflow);
        return this.__securityManager;
    };

    get user (): DorksUserManager {
        if (!this.__userManager) this.__userManager = new DorksUserManager(this.__config, this.__httpWorkflow, this.account);
        return this.__userManager;
    };

    public as = (circleId: Safe<string>): KyodoDorks => {
        return new KyodoDorks({ ...this.__config, enviroment: { scope: 'circle', circleId }, httpWorkflowInstance: this.__httpWorkflow });
    };

    public uploadAvatar = async (buffer: Safe<Buffer>): Promise<UploadMediaResponse> => {
        const response = await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: `/v1/g/s/media/target/user-avatar`,
            body: buffer,
            contentType: 'image/jpeg'
        }, UploadMediaResponseSchema)

        this.account.user.avatar = response.mediaValue;

        return response;
    };

    public uploadBanner = async (buffer: Safe<Buffer>): Promise<UploadMediaResponse> => {
        const response = await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: `/v1/g/s/media/target/user-banner`,
            body: buffer,
            contentType: 'image/jpeg'
        }, UploadMediaResponseSchema)

        this.account.user.banner = response.mediaValue;
        this.account.user.bannerTheme = { dominant: response.pallet.dominant, fgColor: response.pallet.fgColor };

        return response;
    };

    public uploadPersonaAvatar = async (buffer: Safe<Buffer>): Promise<UploadMediaResponse> => {
        return await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: `/v1/g/s/media/target/persona-avatar`,
            body: buffer,
            contentType: 'image/jpeg'
        }, UploadMediaResponseSchema);
    };

    public uploadChatIcon = async (buffer: Safe<Buffer>): Promise<UploadMediaResponse> => {
        return await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: `/v1/g/s/media/target/chat-icon`,
            body: buffer,
            contentType: 'image/jpeg'
        }, UploadMediaResponseSchema);
    };

    public extractLink = async (link: Safe<string>): Promise<ShareLink> => {
        return (await this.__httpWorkflow.sendGet<ExtractLinkResponse>({
            path: `/v1/g/s/share-links${link.split('/s')[1]}`
        }, ExtractLinkResponseSchema)).shareLink;
    };
};