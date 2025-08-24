import { DorksSecurityManager } from '../managers/securityManager';
import { Safe } from '../private';
import { CachedAccount, KyodoDorksConfig } from '../public';
import { HttpWorkflow } from './httpworkflow';
import initLogger from '../utils/logger';

export class KyodoDorks {
    private readonly __config: KyodoDorksConfig;
    private readonly __httpWorkflow: HttpWorkflow;

    private __securityManager?: DorksSecurityManager;

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

    get account (): CachedAccount {
        return this.security.account;
    };

    public as = (circleId: Safe<string>): KyodoDorks => {
        return new KyodoDorks({ ...this.__config, enviroment: { scope: 'circle', circleId }, httpWorkflowInstance: this.__httpWorkflow });
    };
};