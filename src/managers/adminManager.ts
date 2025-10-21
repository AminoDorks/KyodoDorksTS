import { HttpWorkflow } from '../core/httpworkflow';
import { DorksManagerImpl } from '../interfaces/manager';
import { Safe } from '../private';
import { KyodoDorksConfig } from '../public';
import { Circle } from '../schemas/kyodo/circle';
import { GetCircleResponse, GetCircleResponseSchema } from '../schemas/responses/circle';
import { KyodoDorksAPIError } from '../utils/exceptions';

export class DorksAdminManager implements DorksManagerImpl {
    endpoint: string;
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow) {
        if (!config.enviroment.circleId) KyodoDorksAPIError.throw(1);

        this.endpoint = `/v1/${config.enviroment.circleId}/s`;
        this.config = config;
        this.httpWorkflow = httpWorkflow;
    };

    private __editCircleBuilder = async (jsonPayload: string): Promise<Circle> => {
        return (await this.httpWorkflow.sendXSigPost<GetCircleResponse>({
            path: `${this.endpoint}/circles`,
            body: jsonPayload
        }, GetCircleResponseSchema)).circle;
    };

    public icon = async (icon: Safe<string>): Promise<Circle> => { return await this.__editCircleBuilder(JSON.stringify({ icon })); };
    
    public language = async (language: Safe<string>): Promise<Circle> => { return await this.__editCircleBuilder(JSON.stringify({ language })); };
    
    public name = async (name: Safe<string>): Promise<Circle> => { return await this.__editCircleBuilder(JSON.stringify({ name })); };

    public vanity = async (vanity: Safe<string>): Promise<Circle> => { return await this.__editCircleBuilder(JSON.stringify({ vanity })); };

    public banner = async (banner: Safe<string>): Promise<Circle> => { return await this.__editCircleBuilder(JSON.stringify({ banner })); };
};
