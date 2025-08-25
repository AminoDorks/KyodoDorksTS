import { HttpWorkflow } from '../core/httpworkflow';
import { DorksManagerImpl } from '../interfaces/manager';
import { Safe } from '../private';
import { KyodoDorksConfig } from '../public';
import { Circle } from '../schemas/kyodo/circle';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { GetCircleResponse, GetCircleResponseSchema } from '../schemas/responses/circle';
import { KyodoDorksAPIError } from '../utils/exceptions';

export class DorksCircleManager implements DorksManagerImpl {
    endpoint: string;
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow) {
        if (!config.enviroment.circleId) KyodoDorksAPIError.throw(1);

        this.endpoint = `/v1/${config.enviroment.circleId}/s`;
        this.config = config;
        this.httpWorkflow = httpWorkflow;
    };

    public get = async (id?: string): Promise<Circle> => {
        return (await this.httpWorkflow.sendGet<GetCircleResponse>({
            path: `/v1/${id || this.config.enviroment.circleId}/s/circles`
        }, GetCircleResponseSchema)).circle;
    };

    public join = async (): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/circles/join`,
            body: JSON.stringify({})
        }, BasicResponseSchema)
    };

    public leave = async (): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/circles/leave`,
            body: JSON.stringify({})
        }, BasicResponseSchema)
    };

    public report = async (reason: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/reports/content`,
            body: JSON.stringify({
                contentId: this.config.enviroment.circleId,
                contentType: 0,
                type: 2,
                reason
            })
        }, BasicResponseSchema);
    };
};
