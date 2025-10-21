import { DorksSecurityManager } from '../managers/securityManager';
import { Safe } from '../private';
import { KyodoDorksConfig } from '../public';
import { HttpWorkflow } from './httpworkflow';
import { ExtractLinkResponse, ExtractLinkResponseSchema, GetCirclesResponse, UploadMediaResponse, UploadMediaResponseSchema } from '../schemas/responses/global';
import { DorksUserManager } from '../managers/userManager';
import { ShareLink } from '../schemas/kyodo/shareLink';
import { DorksCircleManager } from '../managers/circleManager';
import { GetCircleResponseSchema, GetExploreResponse, GetExploreResponseSchema } from '../schemas/responses/circle';
import { DorksChatManager } from '../managers/chatManager';
import { Circle } from '../schemas/kyodo/circle';
import initLogger from '../utils/logger';
import { DorksPostManager } from '../managers/postManager';
import { SocketWorkflow } from './socketworkflow';
import { DorksAdminManager } from '../managers/adminManager';

export class KyodoDorks {
    private readonly __config: KyodoDorksConfig;
    private readonly __httpWorkflow: HttpWorkflow;

    private __securityManager?: DorksSecurityManager;
    private __userManager?: DorksUserManager;
    private __circleManager?: DorksCircleManager;
    private __chatManager?: DorksChatManager;
    private __postManager?: DorksPostManager;
    private __adminManager?: DorksAdminManager;
    private __socketWorkflow?: SocketWorkflow;

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

    get security (): DorksSecurityManager {
        if (!this.__securityManager) this.__securityManager = new DorksSecurityManager(this.__config, this.__httpWorkflow);
        return this.__securityManager;
    };

    get user (): DorksUserManager {
        if (!this.__userManager) this.__userManager = new DorksUserManager(this.__config, this.__httpWorkflow, this.__config.account || this.security.account);
        return this.__userManager;
    };

    get circle (): DorksCircleManager {
        if (!this.__circleManager) this.__circleManager = new DorksCircleManager(this.__config, this.__httpWorkflow);
        return this.__circleManager;
    };

    get chat (): DorksChatManager {
        if (!this.__chatManager) this.__chatManager = new DorksChatManager(this.__config, this.__httpWorkflow);
        return this.__chatManager;
    };

    get post (): DorksPostManager {
        if (!this.__postManager) this.__postManager = new DorksPostManager(this.__config, this.__httpWorkflow);
        return this.__postManager;
    };

    get admin(): DorksAdminManager {
        if (!this.__adminManager) this.__adminManager = new DorksAdminManager(this.__config, this.__httpWorkflow);
        return this.__adminManager;
    };

    get socket(): SocketWorkflow {
        if (!this.__socketWorkflow) this.__socketWorkflow = new SocketWorkflow(this);
        return this.__socketWorkflow;
    };

    public as = (circleId: Safe<string>): KyodoDorks => {
        return new KyodoDorks({ ...this.__config, enviroment: { scope: 'circle', circleId }, httpWorkflowInstance: this.__httpWorkflow, account: this.security.account });
    };

    private __uploadMedia = async (buffer: Safe<Buffer>, _endpoint: string): Promise<string> => {
        return (await this.__httpWorkflow.sendBuffer<UploadMediaResponse>({
            path: `/v1/g/s/media/target/${_endpoint}`,
            body: buffer,
            contentType: 'image/jpeg'
        }, UploadMediaResponseSchema)).mediaValue;
    };

    public uploadAvatar = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'user-avatar');
    };

    public uploadBanner = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'user-banner');
    };

    public uploadChatIcon = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'chat-icon');
    };

    public uploadChatBackground = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'chat-background');
    };

    public uploadChatMessage = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'chat-message');
    };

    public uploadPostBackground = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'post-background');
    };

    public uploadPostMedia = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'post-media');
    };

    public uploadCircleIcon = async (buffer: Safe<Buffer>): Promise<string> => {
        return await this.__uploadMedia(buffer, 'circle-icon');
    };

    public extractLink = async (link: Safe<string>): Promise<ShareLink> => {
        return (await this.__httpWorkflow.sendGet<ExtractLinkResponse>({
            path: `/v1/g/s/share-links${link.split('/s')[1]}`
        }, ExtractLinkResponseSchema)).shareLink;
    };

    public getExploredCircles = async (showNsfw: Safe<boolean> = false): Promise<GetExploreResponse> => {
        return await this.__httpWorkflow.sendGet<GetExploreResponse>({
            path: `/v1/g/s/homefeed/discovery/explore?showNsfw=${showNsfw}`
        }, GetExploreResponseSchema);
    };

    public getCircles = async (limit: Safe<number> = 100): Promise<Circle[]> => {
        return (await this.__httpWorkflow.sendGet<GetCirclesResponse>({
            path: `/v1/g/s/homefeed/joined?limit=${limit}`
        }, GetCircleResponseSchema)).circles;
    };
};