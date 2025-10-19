import WebSocket from 'ws';

import { Safe } from '../private';
import { BasicEvent, CommandArgsCallback, CommandCallback, EventMap, EventName, MessageEvent, WebSocketCallback } from '../schemas/sockets/sockets';
import { LOGGER } from '../utils/logger';
import { KyodoDorks } from './kyododorks';
import { SOCKET_TOPICS, WEBSOCKET_RECONNECT_TIME, WS_URL } from '../constants';
import { ArgImpl } from '../schemas/sockets/args';

export class SocketWorkflow {
    private __websocket?: WebSocket;
    
    private __client: KyodoDorks;
    private __listeners: Map<Safe<EventName>, Set<WebSocketCallback>> = new Map<Safe<EventName>, Set<WebSocketCallback>>();
    private __circles: Map<Safe<string>, KyodoDorks> = new Map<Safe<string>, KyodoDorks>();

    constructor(client: KyodoDorks) {
        this.__client = client;
        this.__connect();
    };

    private __connect = (): void => {
        if (this.__websocket) this.__websocket.close();
        this.__websocket = new WebSocket(
            `${WS_URL}/?token=${this.__client.security.account.apiToken}&deviceId=${this.__client.security.account.deviceId}`
        )
        LOGGER.info({ url: this.__websocket.url }, 'Socket connected.');
        this.__setupSocketWorkflow();
    };

    private __getCreateCircle = (circleId: string): KyodoDorks => this.__circles.get(circleId) || (this.__circles.set(circleId, this.__client.as(circleId)).get(circleId) as KyodoDorks);

    private __setupSocketWorkflow = (): void => {
        this.__websocket?.on('message', (data: WebSocket.RawData) => {
            const message: BasicEvent = JSON.parse(data.toLocaleString());
            let topicName: string | undefined;

            if (message.o == 1) {
                topicName = SOCKET_TOPICS[`${message.o}_${(message.d as MessageEvent).message.type}` as keyof typeof SOCKET_TOPICS]
                if (!topicName) topicName = SOCKET_TOPICS['1_0'];
            } else topicName = SOCKET_TOPICS[`${message.o}` as keyof typeof SOCKET_TOPICS];

            LOGGER.info({ type: topicName, data: message.d }, 'Received data.');
            const handler = this.__listeners.get(topicName as EventName);
            if (handler) handler.forEach(async (callback) => await callback(this.__getCreateCircle((message.d as MessageEvent).circleId), message.d));
        });

        this.__websocket?.on('error', () => {
            LOGGER.error('Socket error.');
        });

        setTimeout(this.__connect, WEBSOCKET_RECONNECT_TIME);
    };

    public open = (callback: () => void): void => {
        this.__websocket?.on('open', () => {
            callback();
        });
    };

    public close = (callback: (code: number) => void): void => {
        this.__websocket?.on('close', (code: number) => {
            LOGGER.info({ url: this.__websocket?.url, code }, 'Socket closed.');
            callback(code);
        });
    };

    public on = <T extends EventName>(eventName: T, callback: (circle: KyodoDorks, data: EventMap[T]) => Promise<void>): void => {
        if (!this.__listeners.has(eventName)) this.__listeners.set(eventName, new Set());
        this.__listeners.get(eventName)?.add(callback as WebSocketCallback);
    };

    public command = (commandName: Safe<string>, callback: CommandCallback): void => {
        if (!this.__listeners.has('message')) this.__listeners.set('message', new Set());

        const preCallback = (circle: KyodoDorks, data: MessageEvent) => {
            if (
                !data.message.content || 
                !data.message.content.startsWith(commandName)
            ) return;

            callback(
                circle,
                data,
            );
        };
        this.__listeners.get('message')?.add(preCallback as WebSocketCallback);
    };

    public commandArgs = (commandName: Safe<string>, callback: CommandArgsCallback): void => {
        if (!this.__listeners.has('message')) this.__listeners.set('message', new Set());

        const preCallback = (circle: KyodoDorks, data: MessageEvent) => {
            if (
                !data.message.content || 
                !data.message.content.startsWith(commandName)
            ) return;

            callback(
                circle,
                data,
                data.message.content
                    .split(`${commandName} `)[1]
                    .split(' ')
                    .map(item => new ArgImpl(item))
            );
        };
        this.__listeners.get('message')?.add(preCallback as WebSocketCallback);
    };

    public send = (data: WebSocket.Data): void => {
        LOGGER.info({ url: this.__websocket?.url, data: data.toString() }, 'Sending data.');
        this.__websocket?.send(data);
    };
};