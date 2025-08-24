import { HttpWorkflow } from '../core/httpworkflow';
import { KyodoDorksConfig } from '../public';

export interface DorksManagerImpl {
    endpoint: string;
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;
};