import { HttpWorkflow } from "../core/httpworkflow";
import { DorksManagerImpl } from "../interfaces/manager";
import { Safe } from "../private";
import { KyodoDorksConfig, MessageType, StartLimit } from "../public";
import { Chat } from "../schemas/kyodo/chat";
import { MessageItem } from "../schemas/kyodo/messageItem";
import { BasicResponse, BasicResponseSchema } from "../schemas/responses/basic";
import { GetChatResponse, GetChatResponseSchema, GetChatsResponse, GetChatsResponseSchema, SendMessageResponse, SendMessageResponseSchema } from "../schemas/responses/impl";
import { generateRandomValue } from "../utils/crypt";
import { KyodoDorksAPIError } from "../utils/exceptions";

export class DorksChatManager implements DorksManagerImpl {
    endpoint = '/v1/g/s';
    
    config: KyodoDorksConfig;
    httpWorkflow: HttpWorkflow;

    constructor(config: KyodoDorksConfig, httpWorkflow: HttpWorkflow) {
        if (config.enviroment.circleId) this.endpoint = `/v1/${config.enviroment.circleId}/s`;

        this.config = config;
        this.httpWorkflow = httpWorkflow;
    };

    private __editChatBuilder = async (chatId: string, jsonPayload: string): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}`,
            body: jsonPayload
        }, BasicResponseSchema);
    };

    public get = async (id: Safe<string>): Promise<Chat> => {
        return (await this.httpWorkflow.sendGet<GetChatResponse>({
            path: `${this.endpoint}/chats/${id}`
        }, GetChatResponseSchema)).chat;
    };

    public create = async (name: Safe<string>, icon: Safe<string>, invitedIds: Safe<string[]> = []): Promise<Chat> => {
        return (await this.httpWorkflow.sendXSigPost<GetChatResponse>({
            path: `${this.endpoint}/chats`,
            body: JSON.stringify({ name, icon, invitedIds, type: 2 })
        }, GetChatResponseSchema)).chat;
    };

    public createDM = async (invitedIds: Safe<string[]>): Promise<Chat> => {
        return (await this.httpWorkflow.sendXSigPost<GetChatResponse>({
            path: `${this.endpoint}/chats`,
            body: JSON.stringify({ invitedIds, type: 0 })
        }, GetChatResponseSchema)).chat;
    };

    public getMany = async (startLimit: StartLimit = { start: 0, limit: 20 }): Promise<Chat[]> => {
        return (await this.httpWorkflow.sendGet<GetChatsResponse>({
            path: `${this.endpoint}/chats?type=0&start=${startLimit.start}&limit=${startLimit.limit}`
        }, GetChatsResponseSchema)).chats;
    };

    public getPublic = async (startLimit: StartLimit = { start: 0, limit: 10 }): Promise<Chat[]> => {
        if (!this.config.enviroment.circleId) KyodoDorksAPIError.throw(1);

        return (await this.httpWorkflow.sendGet<GetChatsResponse>({
            path: `${this.endpoint}/chats/feed?type=hottest&start=${startLimit.start}&limit=${startLimit.limit}&status=0`
        }, GetChatsResponseSchema)).chats
    };

    public join = async (chatId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/join`,
            body: JSON.stringify({})
        }, BasicResponseSchema);
    };

    public leave = async (chatId: Safe<string>, confirmAsHost: Safe<boolean> = true): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/leave`,
            body: JSON.stringify({ confirmAsHost })
        }, BasicResponseSchema);
    };

    public addCoHost = async (chatId: Safe<string>, userId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/members/cohosts`,
            body: JSON.stringify({ uid: userId })
        }, BasicResponseSchema);
    };

    public transferHost = async (chatId: Safe<string>, userId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/members/host-transfer`,
            body: JSON.stringify({ uid: userId })
        }, BasicResponseSchema);
    };

    public editName = async (chatId: Safe<string>, name: Safe<string>): Promise<BasicResponse> => {
        return await this.__editChatBuilder(chatId, JSON.stringify({ name }));
    };

    public editContent = async (chatId: Safe<string>, content: Safe<string>): Promise<BasicResponse> => {
        return await this.__editChatBuilder(chatId, JSON.stringify({ content }));
    };

    public editIcon = async (chatId: Safe<string>, icon: Safe<string>): Promise<BasicResponse> => {
        return await this.__editChatBuilder(chatId, JSON.stringify({ icon }));
    };

    public editBackground = async (chatId: Safe<string>, background: Safe<string>): Promise<BasicResponse> => {
        return await this.__editChatBuilder(chatId, JSON.stringify({ background }));
    };

    public editReadOnly = async (chatId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendXSigPost<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/read-only`,
            body: JSON.stringify({})
        }, BasicResponseSchema);
    };

    public sendMessage = async (chatId: Safe<string>, content: Safe<string>, type: MessageType = 0, replyMessageId?: Safe<string>): Promise<MessageItem> => {
        return (await this.httpWorkflow.sendXSigPost<SendMessageResponse>({
            path: `${this.endpoint}/chats/${chatId}/messages`,
            body: JSON.stringify({
                content,
                config: {
                    type,
                    refId: generateRandomValue(),
                    replyMessageId
                }
            })
        }, SendMessageResponseSchema)).messageItem;
    };

    public deleteMessage = async (chatId: Safe<string>, messageId: Safe<string>): Promise<BasicResponse> => {
        return await this.httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/chats/${chatId}/messages/${messageId}`
        }, BasicResponseSchema);
    };
};