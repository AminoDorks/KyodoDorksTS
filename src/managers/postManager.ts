import { HttpWorkflow } from '../core/httpworkflow';
import { DorksManagerImpl } from '../interfaces/manager';
import { Safe } from '../private';
import { KyodoDorksConfig, StartLimit } from '../public';
import { Post } from '../schemas/kyodo/post';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { GetPostResponse, GetPostResponseSchema, GetPostsResponse, GetPostsResponseSchema } from '../schemas/responses/circle';
import { KyodoDorksAPIError } from '../utils/exceptions';
import { parseMediaMap } from '../utils/utils';

export class DorksPostManager implements DorksManagerImpl {
    endpoint: string;
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow) {
        if (!config.enviroment.circleId) KyodoDorksAPIError.throw(1);

        this.endpoint = `/v1/${config.enviroment.circleId}/s`;
        this.config = config;
        this.httpWorkflow = httpWorkflow;
    };

    public get = async (id: Safe<string>): Promise<Post> => {
        return (await this.httpWorkflow.sendGet<GetPostResponse>({
            path: `${this.endpoint}/posts/${id}`
        }, GetPostResponseSchema)).post;
    };

    public create = async (title: Safe<string>, content: Safe<string>, cover: Safe<string>, backgroundUrl?: Safe<string>): Promise<Post> => {
        return (await this.httpWorkflow.sendXSigPost<GetPostResponse>({
            path: `${this.endpoint}/posts`,
            body: JSON.stringify({
                title,
                content,
                config: {
                    mediaMap: parseMediaMap(cover, true),
                    backgroundUrl
                }
            })
        }, GetPostResponseSchema)).post;
    };

    public getManyFrom = async (startLimit: StartLimit = { start: 0, limit: 15 }, userId: Safe<string> = ''): Promise<Post[]> => {
        return (await this.httpWorkflow.sendGet<GetPostsResponse>({
            path: `${this.endpoint}/posts?type=0&limit=${startLimit.limit}&pt=&uid=${userId}&parentId=&q=&v=2`
        }, GetPostsResponseSchema)).posts;
    };

    public sendComment = async (postId: Safe<string>, content: Safe<string>, title: Safe<string> = '-'): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/posts`,
            body: JSON.stringify({
                title,
                content,
                config: {
                    parentPostId: postId
                }
            })
        }, BasicResponseSchema);
    };

    public likeStatus = async (postId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/posts/${postId}/like`,
            body: JSON.stringify({})
        }, BasicResponseSchema);
    };
};