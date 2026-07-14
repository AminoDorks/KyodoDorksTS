import { file } from 'bun';
import type { Logger } from 'pino';

import { Http } from './http';
import { configureLogger } from '../util/logger';
import { AuthAPI } from '../api/auth';
import { ChatAPI } from '../api/chat';
import { CircleAPI } from '../api/circle';
import { PostAPI } from '../api/post';
import { UserAPI } from '../api/user';
import { AdminAPI } from '../api/admin';
import { type UploadResponse, UploadResponseSchema } from '../dto/common.dto';
import type { DorksConfig, UploadTarget } from '../types/usable';
import type { Account } from '../entities/account';

export class KyodoDorks {
  private config: DorksConfig;
  private logger: Logger;
  private http: Http;

  private _account?: Account;
  private circleId?: string;
  private authApi?: AuthAPI;
  private chatApi?: ChatAPI;
  private circleApi?: CircleAPI;
  private postApi?: PostAPI;
  private userApi?: UserAPI;
  private adminApi?: AdminAPI;

  constructor(config: DorksConfig = {}) {
    this.config = config;
    this.logger = configureLogger(!!config.enableLogging);
    this.http = config.http ?? new Http(this.logger);
    this.circleId = config.circleId;
    this._account = config.account;
  }

  get account() {
    return this._account || this.authApi!.account;
  }

  get auth() {
    if (!this.authApi) this.authApi = new AuthAPI(this.http);
    return this.authApi;
  }

  get chat() {
    if (!this.chatApi) this.chatApi = new ChatAPI(this.http, this.account, this.circleId);
    return this.chatApi;
  }

  get circle() {
    if (!this.circleApi) this.circleApi = new CircleAPI(this.http);
    return this.circleApi;
  }

  get post() {
    if (!this.circleId) throw new Error('circleId is required');

    if (!this.postApi) this.postApi = new PostAPI(this.http, this.circleId);
    return this.postApi;
  }

  get user() {
    if (!this.userApi) this.userApi = new UserAPI(this.http, this.account, this.circleId);
    return this.userApi;
  }

  get admin() {
    if (!this.circleId) throw new Error('circleId is required');

    if (!this.adminApi) this.adminApi = new AdminAPI(this.http, this.circleId);
    return this.adminApi;
  }

  set proxy(value: string) {
    this.http.proxy = value;
  }

  public upload = async (
    path: string,
    target: UploadTarget,
    contentType: 'image/jpg' | 'video/mp4'
  ): Promise<string> =>
    (
      await this.http.media<UploadResponse>(
        {
          path: `/g/s/media/target/${target}`,
          body: await file(path).arrayBuffer(),
          contentType,
        },
        UploadResponseSchema
      )
    ).media.url;

  public as = (circleId: string): KyodoDorks =>
    new KyodoDorks({ ...this.config, circleId, account: this.auth.account, http: this.http });
}
