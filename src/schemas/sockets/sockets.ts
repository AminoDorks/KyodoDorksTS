import { z } from 'zod';

import { MessageSchema } from '../kyodo/message';
import { KyodoDorks } from '../../core/kyododorks';

export interface Arg {
    readonly rawValue: string;

    getNumber(): number;
    getString(): string;
    getBoolean(): boolean;
};

export const MessageEventSchema = z.object({
    chatId: z.string(),
    circleId: z.string(),
    message: MessageSchema
});

export const NotificationEventSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    url: z.string(),
    data: z.object({
        chatId: z.string(),
        imageUrl: z.string(),
        kyodoNotificationId: z.string()
    }),
    imageUrl: z.string(),
    circleMeta: z.object({
        name: z.string(),
        icon: z.string()
    })
});

const EventMapSchema = z.object({
    message: MessageEventSchema,
    notify: NotificationEventSchema
})

export const EventNameEnum = EventMapSchema.keyof();

export const WebSocketEventSchema = z.union([
    MessageEventSchema,
    NotificationEventSchema
]);

export const BasicEventSchema = z.object({
    o: z.number(),
    d: WebSocketEventSchema
});

export const CommandDataSchema = z.object({
    message: MessageSchema,
    chatId: z.string(),
    circleId: z.string(),
});

export type BasicEvent = z.infer<typeof BasicEventSchema>;
export type MessageEvent = z.infer<typeof MessageEventSchema>;
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;
export type EventMap = z.infer<typeof EventMapSchema>;
export type EventName = z.infer<typeof EventNameEnum>;
export type WebSocketEvent = z.infer<typeof WebSocketEventSchema>;
export type CommandData = z.infer<typeof CommandDataSchema>;
export type WebSocketCallback = (circle: KyodoDorks, data: WebSocketEvent) => Promise<void>;
export type CommandCallback = (circle: KyodoDorks, callbackData: CommandData) => Promise<void>;
export type CommandArgsCallback = (circle: KyodoDorks, callbackData: CommandData, args: Arg[]) => Promise<void>;