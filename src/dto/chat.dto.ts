import z from 'zod';

import { CommonResponseSchema } from './common.dto';
import { ChatSchema } from '../entities/chat';
import { MemberSchema } from '../entities/member';
import { MessageSchema } from '../entities/message';

export const ChatResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  chat: ChatSchema,
});

export const ManyChatsResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  chatList: z.array(ChatSchema),
});

export const MembersResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  chatMemberList: z.array(MemberSchema),
});

export const SendMessageResponseSchema = z.object({
  ...CommonResponseSchema.shape,
  chatMessage: MessageSchema,
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ManyChatsResponse = z.infer<typeof ManyChatsResponseSchema>;
export type MembersResponse = z.infer<typeof MembersResponseSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
