import { randomUUID } from 'crypto';

import {
  type ChatResponse,
  ChatResponseSchema,
  type ManyChatsResponse,
  ManyChatsResponseSchema,
  type MembersResponse,
  MembersResponseSchema,
  type SendMessageResponse,
  SendMessageResponseSchema,
} from '../dto/chat.dto';
import type { Http } from '../client/http';
import type { Chat } from '../entities/chat';
import type {
  CreateChatBuilder,
  GetMembersBuilder,
  ManyChatsBuilder,
  TextMessageBuilder,
} from '../types/usable';
import type { Member } from '../entities/member';
import type { Message } from '../entities/message';
import type { Account } from '../entities/account';

export class ChatAPI {
  private http: Http;
  private account: Account;

  private circleId?: string;
  private endpoint: string = '/g/s';

  constructor(http: Http, account: Account, circleId?: string) {
    this.http = http;
    this.account = account;

    if (circleId) {
      this.circleId = circleId;
      this.endpoint = `/${circleId}/s`;
    }
  }

  private changeState = async (chatId: string, state: 'leave' | 'join'): Promise<Chat> =>
    (
      await this.http.post<ChatResponse>(
        { path: `${this.endpoint}/chats/${chatId}/${state}`, body: JSON.stringify({}) },
        ChatResponseSchema
      )
    ).chat;

  public get = async (chatId: string): Promise<Chat> =>
    (await this.http.get<ChatResponse>(`${this.endpoint}/chats/${chatId}`, ChatResponseSchema))
      .chat;

  public many = async ({ size, t, type }: ManyChatsBuilder = { size: 25, type: 'discover' }) => {
    const query = new URLSearchParams({
      type: this.circleId ? type : 'joined-active-global',
      size: size.toString(),
    });
    if (t) query.set('t', t.toString());

    return await this.http.get<ManyChatsResponse>(
      `${this.endpoint}/chats?${query.toString()}`,
      ManyChatsResponseSchema
    );
  };

  public members = async ({ chatId, type, size, t }: GetMembersBuilder): Promise<Member[]> => {
    const query = new URLSearchParams({
      type,
      size: size.toString(),
    });
    if (t) query.set('t', t.toString());

    return (
      await this.http.get<MembersResponse>(
        `${this.endpoint}/chats/${chatId}/members?${query.toString()}`,
        MembersResponseSchema
      )
    ).chatMemberList;
  };

  public join = async (chatId: string): Promise<Chat> => await this.changeState(chatId, 'join');

  public leave = async (chatId: string): Promise<Chat> => await this.changeState(chatId, 'leave');

  public text = async (builder: TextMessageBuilder): Promise<Message> =>
    (
      await this.http.post<SendMessageResponse>(
        {
          path: `${this.endpoint}/chats/${builder.chatId}/messages`,
          body: JSON.stringify({ ...builder, refId: `${this.account.uid}.${randomUUID()}` }),
        },
        SendMessageResponseSchema
      )
    ).chatMessage;

  public create = async (builder: CreateChatBuilder): Promise<Chat> =>
    (
      await this.http.post<ChatResponse>(
        { path: `${this.endpoint}/chats`, body: JSON.stringify(builder) },
        ChatResponseSchema
      )
    ).chat;
}
