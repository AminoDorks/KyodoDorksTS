import { ZodObject } from 'zod';
import { Dispatcher, request } from 'undici';
import BodyReadable from 'undici/types/readable';

import { HeadersType } from '../private';
import { BasicAppResponseSchema, BasicResponseSchema } from '../schemas/responses/basic';
import { LOGGER } from '../utils/logger';
import { generateHalfDeviceId, generateXSig, generateXSignature } from '../utils/crypt';
import { BufferRequestConfig, DeleteRequestConfig, GetRequestConfig, PostRequestConfig } from '../schemas/httpworkflow';
import { KyodoDorksAPIError } from '../utils/exceptions';
import { API_URL, APP_URL, KYODO_API_HEADERS, KYODO_APP_HEADERS } from '../constants';

export class HttpWorkflow {
    private __headers: HeadersType = KYODO_API_HEADERS;

    constructor() { this.headers = { 'device-id': generateHalfDeviceId() }; };

    set headers (headers: HeadersType) {
        this.__headers = {
            ...this.__headers,
            ...headers
        };
    };

    private __mergeHeaders = (contentType?: string): HeadersType => {
        const mergedHeaders = JSON.parse(JSON.stringify(this.__headers));
        
        mergedHeaders['x-signature'] = generateXSignature();
        mergedHeaders['start-time'] = Date.now().toString();
        if (contentType) mergedHeaders['Content-Type'] = contentType;

        return mergedHeaders;
    };

    private __prepareHeaders = (body: Buffer, contentType?: string): HeadersType => {
        const headers = this.__mergeHeaders(contentType);

        headers['Content-Length'] = body.length.toString();

        return headers;
    };

    private __xSigHeaders = (body: Buffer, contentType?: string): HeadersType => {
        const preparedHeaders = this.__prepareHeaders(body, contentType);

        preparedHeaders['x-sig'] = generateXSig({
            startTime: preparedHeaders['start-time'],
            uid: preparedHeaders['uid'],
            deviceId: preparedHeaders['device-id'],
            data: JSON.stringify(body)
        });

        return preparedHeaders;
    };

    private __handleResponse = async <T>(path: string, body: BodyReadable & Dispatcher.BodyMixin, schema: ZodObject): Promise<T> => {
        const rawBody = JSON.parse(await body.text());
        
        const responseSchema = BasicResponseSchema.parse(rawBody);
        LOGGER.child({ path: path }).info(responseSchema.message);

        if (responseSchema.code != 200) KyodoDorksAPIError.throw(responseSchema.code);

        return schema.parse(rawBody) as T;
    };

    private __handleAppResponse = async <T>(path: string, body: BodyReadable & Dispatcher.BodyMixin, statusCode: number, schema: ZodObject): Promise<T> => {
        if (statusCode != 200) KyodoDorksAPIError.throw(statusCode);
        
        const rawBody = JSON.parse(await body.text());
        
        const responseSchema = BasicAppResponseSchema.parse(rawBody);
        LOGGER.child({ path: path }).info(responseSchema.message);

        return schema.parse(rawBody) as T;
    };

    public header = (key: string) => this.__headers[key];
    
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    public deleteHeader = (key: string) => delete this.__headers[key];

    public sendGet = async <T>(config: GetRequestConfig, schema: ZodObject): Promise<T> => {
        const { body } = await request(`${API_URL}${config.path}`, {
            method: 'GET',
            headers: this.__mergeHeaders(config.contentType)
        });

        return this.__handleResponse(`${API_URL}${config.path}`, body, schema);
    };

    public sendDelete = async <T>(config: DeleteRequestConfig, schema: ZodObject): Promise<T> => {
        const { body } = await request(`${API_URL}${config.path}`, {
            method: 'DELETE',
            headers: this.__mergeHeaders()
        });

        return this.__handleResponse(`${API_URL}${config.path}`, body, schema);
    };

    public sendPost = async <T>(config: PostRequestConfig, schema: ZodObject): Promise<T> => {
        const { body } = await request(`${API_URL}${config.path}`, {
            method: 'POST',
            headers: this.__prepareHeaders(Buffer.from(config.body), config.contentType),
            body: config.body
        });

        return this.__handleResponse(`${API_URL}${config.path}`, body, schema);
    };

    public sendServicedPost = async <T>(config: PostRequestConfig, schema: ZodObject): Promise<T> => {
        const { statusCode, body } = await request(`${APP_URL}${config.path}`, {
            method: 'POST',
            headers: KYODO_APP_HEADERS,
            body: config.body
        });

        return this.__handleAppResponse(`${APP_URL}${config.path}`, body, statusCode, schema);
    };

    public sendXSigPost = async <T>(config: PostRequestConfig, schema: ZodObject): Promise<T> => {
        const { body } = await request(`${API_URL}${config.path}`, {
            method: 'POST',
            headers: this.__xSigHeaders(Buffer.from(config.body), config.contentType),
            body: config.body
        });

        return this.__handleResponse(`${API_URL}${config.path}`, body, schema);
    };

    public sendBuffer = async <T>(config: BufferRequestConfig, schema: ZodObject): Promise<T> => {
        const { body } = await request(`${API_URL}${config.path}`, {
            method: 'POST',
            headers: this.__xSigHeaders(config.body, config.contentType),
            body: config.body
        });

        return this.__handleResponse(`${API_URL}${config.path}`, body, schema);
    };
};