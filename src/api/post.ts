import {
  type GetPostResponse,
  GetPostResponseSchema,
  type ManyPostsResponse,
  ManyPostsResponseSchema,
} from '../dto/post.dto';
import type { Http } from '../client/http';
import type { Post } from '../entities/post';
import type { CommentBuilder, CreatePostBuilder, ManyPostsBuilder } from '../types/usable';

export class PostAPI {
  private http: Http;
  private endpoint: string;

  constructor(http: Http, circleId: string) {
    this.http = http;
    this.endpoint = `/${circleId}/s`;
  }

  public get = async (postId: string): Promise<Post> =>
    (
      await this.http.get<GetPostResponse>(
        `${this.endpoint}/posts/${postId}`,
        GetPostResponseSchema
      )
    ).post;

  public many = async (
    { type, size, parentId }: ManyPostsBuilder = { size: 25, type: 'latest' }
  ): Promise<Post[]> => {
    const query = new URLSearchParams({ type, size: size.toString() });

    if (parentId) query.append('parentId', parentId);

    return (
      await this.http.get<ManyPostsResponse>(
        `${this.endpoint}/posts?${query.toString()}`,
        ManyPostsResponseSchema
      )
    ).postList;
  };

  public like = async (postId: string): Promise<Post> =>
    (
      await this.http.post<GetPostResponse>(
        { path: `${this.endpoint}/posts/${postId}/like`, body: JSON.stringify({}) },
        GetPostResponseSchema
      )
    ).post;

  public comment = async ({ content, parentPostId, mediaList }: CommentBuilder): Promise<Post> =>
    (
      await this.http.post<GetPostResponse>(
        {
          path: `${this.endpoint}/posts`,
          body: JSON.stringify({ content, mediaList, parentPostId, type: 4 }),
        },
        GetPostResponseSchema
      )
    ).post;

  public create = async ({ content, title, cover }: CreatePostBuilder): Promise<Post> =>
    (
      await this.http.post<GetPostResponse>(
        {
          path: `${this.endpoint}/posts`,
          body: JSON.stringify({
            content,
            title,
            type: 0,
            mediaMap: { cover: { isCover: true, src: cover, type: 0 } },
          }),
        },
        GetPostResponseSchema
      )
    ).post;
}
