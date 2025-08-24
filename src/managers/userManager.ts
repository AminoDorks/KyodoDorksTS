import { HttpWorkflow } from '../core/httpworkflow';
import { DorksManagerImpl } from '../interfaces/manager';
import { Safe } from '../private';
import { CachedAccount, KyodoDorksConfig, StartLimit, UsersFilter } from '../public';
import { User } from '../schemas/kyodo/user';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { GetUserResponse, GetUserResponseSchema, GetUsersResponse, GetUsersResponseSchema } from '../schemas/responses/impl';
import { KyodoDorksAPIError } from '../utils/exceptions';

export class DorksUserManager implements DorksManagerImpl {
    endpoint = '/v1/g/s';
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    private __account: CachedAccount;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow, account: CachedAccount) {
        if (config.enviroment.circleId) this.endpoint = `/v1/${config.enviroment.circleId}/s`
        this.config = config;
        this.httpWorkflow = httpWorkflow;
        this.__account = account;
    };

    private __editProfileBuilder = async (jsonPayload: string): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/users/${this.__account.user.id}`,
            body: jsonPayload
        }, BasicResponseSchema);
    };

    public get = async (id: Safe<string>): Promise<GetUserResponse> => {
        return await this.httpWorkflow.sendGet<GetUserResponse>({
            path: `${this.endpoint}/users/${id}`
        }, GetUserResponseSchema);
    };

    public getMany = async (startLimit: StartLimit = { start: 0, limit: 15 }, filter: UsersFilter = 'all'): Promise<User[]> => {
        if (!this.config.enviroment.circleId) KyodoDorksAPIError.throw(1);

        return (await this.httpWorkflow.sendGet<GetUsersResponse>({
            path: `${this.endpoint}/users?limit=${startLimit.limit}&start=${startLimit.start}&role=&q=&filter=${filter}`
        }, GetUsersResponseSchema)).users;
    };

    public nickname = async (nickname: Safe<string>): Promise<BasicResponse> => { return await this.__editProfileBuilder(JSON.stringify({ nickname })); };

    public bio = async (bio: Safe<string>): Promise<BasicResponse> => { return await this.__editProfileBuilder(JSON.stringify({ bio })); };

    public avatar = async (avatar: Safe<string>): Promise<BasicResponse> => { return await this.__editProfileBuilder(JSON.stringify({ avatar })); };

    public banner = async (banner: Safe<string>): Promise<BasicResponse> => { return await this.__editProfileBuilder(JSON.stringify({ banner })); };
};