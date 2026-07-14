import { cacheGet, cacheSet, initCache } from '../util/cache';
import { type AuthenticationResponse, AuthenticationResponseSchema } from '../dto/auth.dto';
import { CommonResponseSchema, type CommonResponse } from '../dto/common.dto';
import type { Http } from '../client/http';
import type { Account } from '../entities/account';
import type { AuthenticateBuilder } from '../types/auth';
import type { RegisterBuilder } from '../types/usable';

export class AuthAPI {
  private http: Http;
  private _account: Account | undefined;

  constructor(http: Http) {
    this.http = http;
  }

  get account(): Account {
    if (!this._account) {
      throw new Error('Unauthorized');
    }

    return this._account;
  }

  private _authenticate = async (builder: AuthenticateBuilder): Promise<Account> => {
    await initCache();

    const cachedUnit = cacheGet(`${builder.email}:${builder.secret}`);

    if (cachedUnit) {
      this.http.headers = { authorization: cachedUnit.token, 'device-id': cachedUnit.deviceId };
      return (this._account = cachedUnit.account);
    }

    const { account, token } = await this.http.post<AuthenticationResponse>(
      {
        path: builder.path,
        body: JSON.stringify({
          email: builder.email,
          secret: builder.secret,
          ...(builder.body ?? {}),
        }),
      },
      AuthenticationResponseSchema
    );

    this.http.headers = { authorization: token };

    cacheSet(`${builder.email}:${builder.secret}`, {
      token,
      account,
      deviceId: this.http.deviceId,
    });

    return (this._account = account);
  };

  public checkMail = async (email: string): Promise<CommonResponse> =>
    await this.http.post<CommonResponse>(
      { path: '/g/s/auth/email-available-check', body: JSON.stringify({ email }) },
      CommonResponseSchema
    );

  public checkUsername = async (username: string): Promise<CommonResponse> =>
    await this.http.post<CommonResponse>(
      { path: '/g/s/auth/username-check', body: JSON.stringify({ username }) },
      CommonResponseSchema
    );

  public sendCode = async (email: string): Promise<CommonResponse> =>
    await this.http.post<CommonResponse>(
      { path: '/g/s/auth/otp/send-email-verification', body: JSON.stringify({ email }) },
      CommonResponseSchema
    );

  public verifyCode = async (email: string, code: number): Promise<CommonResponse> =>
    await this.http.post<CommonResponse>(
      {
        path: '/g/s/auth/otp/email-verification',
        body: JSON.stringify({ email, verificationCode: code }),
      },
      CommonResponseSchema
    );

  public register = async ({ username, email, secret }: RegisterBuilder): Promise<Account> =>
    await this._authenticate({
      path: `/g/s/auth/register`,
      email,
      secret,
      body: {
        username,
        birthday: 'Mon Feb 21 2007 03:00:00 GMT+0300',
        turnstileToken: 'а у разраба киодо мамка шалава',
      },
    });

  public login = async (email: string, secret: string): Promise<Account> =>
    await this._authenticate({ path: `/g/s/auth/login`, email, secret, body: { type: 0 } });
}
