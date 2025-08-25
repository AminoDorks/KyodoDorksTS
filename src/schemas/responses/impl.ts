import { z } from 'zod';
import { BasicResponseSchema } from './basic';
import { UserSchema } from '../kyodo/user';
import { ChatSchema } from '../kyodo/chat';
import { MessageItemSchema } from '../kyodo/messageItem';

export const GetUserResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    user: UserSchema,
    circle: z.nullable(z.object())
});

export const GetUsersResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    users: z.array(UserSchema)
});

export const GetChatResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    chat: ChatSchema
});

export const GetChatsResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    chats: z.array(ChatSchema)
});

export const SendMessageResponseSchema = z.object({
    ...BasicResponseSchema.shape,
    messageItem: MessageItemSchema
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
export type GetChatResponse = z.infer<typeof GetChatResponseSchema>;
export type GetChatsResponse = z.infer<typeof GetChatsResponseSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;