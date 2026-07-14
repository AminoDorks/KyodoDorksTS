import type { Http } from '../client/http';
import type { Account } from '../entities/account';

export type UploadTarget =
  | 'chat/video'
  | 'post/media'
  | 'circle/icon'
  | 'circle/gallery'
  | 'circle/sidebar'
  | 'chat/gallery'
  | 'chat/wallpaper'
  | 'chat/message'
  | 'chat/icon'
  | 'post/gallery'
  | 'user/cover'
  | 'user/avatar'
  | 'user/gallery'
  | 'sticker'
  | 'persona/icon'
  | 'persona/gallery';

export type ChatType = 'discover' | 'invited' | 'joined-active';

export type MemberType = 'host' | 'co-hosts' | 'all';

export type PostType = 'latest' | 'pinned' | 'featured' | 'wiki';

export type UserType = 'online' | 'online-following' | 'followers';

export type DorksConfig = {
  enableLogging?: boolean;
  http?: Http;
  circleId?: string;
  account?: Account;
};

export type RegisterBuilder = {
  email: string;
  secret: string;
  username: string;
};

export type ManyChatsBuilder = {
  size: number;
  t?: number;
  type: ChatType;
};

export type GetMembersBuilder = {
  chatId: string;
  type: MemberType;
  size: number;
  t?: number;
};

export type TextMessageBuilder = {
  chatId: string;
  type: number;
  content: string;
  replyMessageId?: string;
};

export type CreateChatBuilder = {
  type: number;
  inviteeUids: string[];
  initialMessage?: string;
};

export type ManyPostsBuilder = {
  type: PostType;
  size: number;
  parentId?: string;
};

export type CommentBuilder = {
  content: string;
  parentPostId: string;
  mediaList?: string[];
};

export type ManyUsersBuilder = {
  size: number;
  type: UserType;
  parentId?: string;
};

export type EditUserBuilder = {
  nickname?: string;
  avatar?: string;
  cover?: string;
  theme?: {
    fg: string;
    bg: string;
  };
  bio?: string;
};

export type BroadcastBuilder = {
  content: string;
  objectId: string;
  objectType: number;
};
