import { DorksSecurityManager } from '../managers/securityManager';
import { Safe } from '../private';
import { KyodoDorksConfig } from '../public';
import { HttpWorkflow } from './httpworkflow';
import initLogger from '../utils/logger';

export class KyodoDorks {
    private readonly __config: KyodoDorksConfig;

    private __securityManager?: DorksSecurityManager;

    constructor(config: KyodoDorksConfig = { enviroment: { scope: 'global' } }) {
        this.__config = config;
        this.__config.httpWorkflow = this.__config.httpWorkflow || new HttpWorkflow();

        if (this.__config.credentials) {
            this.__config.httpWorkflow.headers = {
                'device-id': this.__config.credentials.deviceId,
                'authorization': this.__config.credentials.apiToken
            };
        };

        initLogger(!!config.enableLogging);
    };

    get config(): KyodoDorksConfig {
        return this.__config;
    };

    get security(): DorksSecurityManager {
        if (!this.__securityManager) this.__securityManager = new DorksSecurityManager(this.__config);
        return this.__securityManager;
    };

    public as = (circleId: Safe<string>): KyodoDorks => {
        return new KyodoDorks({ ...this.__config, enviroment: { scope: 'circle', circleId }, httpWorkflow: this.__config.httpWorkflow });
    };
};