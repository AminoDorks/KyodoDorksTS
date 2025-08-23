import { DorksManagerImpl } from '../interfaces/manager';
import { KyodoDorksConfig } from '../public';

export class DorksSecurityManager implements DorksManagerImpl {
    endpoint = '/g/s';
    
    config: KyodoDorksConfig;

    constructor(config: KyodoDorksConfig) {
        this.config = config;
    };
};