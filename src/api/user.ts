import {
  type GetUserResponse,
  GetUserResponseSchema,
  type ManyUsersResponse,
  ManyUsersResponseSchema,
} from '../dto/user.dto';
import type { Http } from '../client/http';
import type { Account } from '../entities/account';
import type { User } from '../entities/user';
import type { EditUserBuilder, ManyUsersBuilder } from '../types/usable';

export class UserAPI {
  private http: Http;
  private account: Account;

  private endpoint: string = '/g/s';

  constructor(http: Http, account: Account, circleId?: string) {
    this.http = http;
    this.account = account;

    if (circleId) {
      this.endpoint = `/${circleId}/s`;
    }
  }

  public get = async (userId: string): Promise<User> =>
    (
      await this.http.get<GetUserResponse>(
        `${this.endpoint}/users/${userId}`,
        GetUserResponseSchema
      )
    ).userProfile;

  public many = async (
    { size, type, parentId }: ManyUsersBuilder = { size: 20, type: 'online' }
  ): Promise<User[]> => {
    const query = new URLSearchParams({ type, size: size.toString() });

    if (parentId) query.append('parentId', parentId);

    return (
      await this.http.get<ManyUsersResponse>(
        `${this.endpoint}/users?${query.toString()}`,
        ManyUsersResponseSchema
      )
    ).userProfileList;
  };

  public edit = async (builder: EditUserBuilder): Promise<User> =>
    (
      await this.http.post<GetUserResponse>(
        { path: `${this.endpoint}/users/${this.account.uid}`, body: JSON.stringify(builder) },
        GetUserResponseSchema
      )
    ).userProfile;

  public status = async (appearOnline: boolean, content: string): Promise<User> =>
    (
      await this.http.post<GetUserResponse>(
        {
          path: `${this.endpoint}/users/${this.account.uid}/status`,
          body: JSON.stringify({ appearOnline, content }),
        },
        GetUserResponseSchema
      )
    ).userProfile;

  public follow = async (userId: string): Promise<User> =>
    (
      await this.http.post<GetUserResponse>(
        {
          path: `${this.endpoint}/users/${userId}/following`,
          body: JSON.stringify({}),
        },
        GetUserResponseSchema
      )
    ).userProfile;
}
