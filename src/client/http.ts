import { fetch } from 'netbun';
import type { ZodType } from 'zod';
import type { Logger } from 'pino';

import { BASE_HEADERS, BASE_URL } from '../constants';
import { generateDeviceId } from '../util/crypto';
import { isOk } from '../util/helpers';
import { KyodoError } from '../util/errors';
import { CommonResponseSchema } from '../dto/common.dto';
import type { CallBuilder, HandleBuilder, Headers, PostBuilder } from '../types/http';

export class Http {
  private _headers: Headers = { ...BASE_HEADERS };

  private logger: Logger;
  private _proxy?: string;

  constructor(logger: Logger, deviceId: string = generateDeviceId()) {
    this.logger = logger;
    this.headers = { 'device-id': deviceId };
  }

  get headers(): Headers {
    return this._headers;
  }

  get proxy(): string | undefined {
    return this._proxy;
  }

  get deviceId(): string {
    return this._headers['device-id'] as string;
  }

  set headers(value: Headers) {
    this._headers = {
      ...this._headers,
      ...value,
    };
  }

  set proxy(value: string) {
    this._proxy = value;
  }

  private handle = async <T>(
    { status, path, json }: HandleBuilder,
    schema: ZodType<T>
  ): Promise<T> => {
    const { message } = CommonResponseSchema.parse(json);

    if (!isOk(status)) {
      this.logger.error({ path }, message);

      throw new KyodoError(message);
    }

    const parsed = schema.parse(json);

    this.logger.info({ path }, message);

    return parsed;
  };

  private call = async <T>(
    { method, path, body, headers }: CallBuilder,
    schema: ZodType<T>
  ): Promise<T> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body,
      proxy: this._proxy,
    });

    return await this.handle(
      { status: response.status, path, json: await response.json() },
      schema
    );
  };

  public get = async <T>(path: string, schema: ZodType<T>): Promise<T> =>
    await this.call({ method: 'GET', path, headers: this.headers }, schema);

  public post = async <T>({ path, body }: PostBuilder, schema: ZodType<T>): Promise<T> =>
    await this.call({ method: 'POST', path, headers: this.headers, body }, schema);

  public media = async <T>(
    { path, body, contentType }: PostBuilder,
    schema: ZodType<T>
  ): Promise<T> =>
    await this.call(
      {
        method: 'POST',
        path,
        headers: { ...this.headers, ...(contentType ? { 'Content-Type': contentType } : {}) },
        body,
      },
      schema
    );
}
